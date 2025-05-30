import { Body, Controller , HttpException, HttpStatus, Patch, Post, Req, Res} from '@nestjs/common';
import { SignUpDTO, LoginDTO, UpgradeToAdminDTO} from '../DTO/DTO';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';

import { Response, Request } from 'express';

@Controller('user')
export class UserController {

    constructor(private userService : UserService, private authService : AuthService) {}

    @Post("signup")
    async signUp(@Body() signUpDTO : SignUpDTO ) {
        console.log("Inside UserController signup");
        const createdUser = await this.userService.signUp(signUpDTO) ;
        if (!createdUser) {
            throw new HttpException('Failed to sign up', HttpStatus.NOT_FOUND);
        }
        else {
            return { message: "User created successfully" };
        }
        
    }

    @Post("login")
    async login(@Body() loginDTO : LoginDTO, @Res({ passthrough: true }) response: Response) {
        console.log("Inside UserController login");
        try {
            const loginUser = await this.userService.login(loginDTO) ;
            const { accessToken, refreshToken } = await this.authService.generateTokens(loginUser.email);
            response.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                // path: '/auth/refresh',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });
            response.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                // path: '/auth/refresh',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });
            return { message: "Login successful" , user: loginUser };
        }

        catch (error) {
            console.error("Login error: ", error);
            throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        console.log("Inside Logout ");
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { message: 'Logged out' };
    }

    @Patch('upgrade')
    upgradeToAdmin(@Body() upgradeToAdminDTO : UpgradeToAdminDTO) {
        console.log("Inside User Controller Upgrade to Admin");
        
        const upgradeToAdminResult =  this.userService.upgradeToAdmin(upgradeToAdminDTO.userId);
        if (!upgradeToAdminResult) {
            throw new HttpException('Failed to upgrade user to admin', HttpStatus.NOT_FOUND);
        }
        console.log("User upgraded to admin successfully");
        return { message: 'User upgraded to admin successfully' };
    }

    @Post('refresh')
    refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        console.error("Inside Refresh ");
        const accessToken = req.cookies['access_token'];
        const refreshToken = req.cookies['refresh_token'];

        console.log("Cookies: ", req.cookies);
        console.log("Access Token: ", accessToken);
        console.log("Refresh Token: ", refreshToken);

        if (!accessToken || !refreshToken) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        const renewedAccessToken = this.authService.refreshAccessToken(refreshToken);
        
        res.cookie('access_token', renewedAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            // path: '/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
        return { message: 'Tokens refreshed' };
    }
}
