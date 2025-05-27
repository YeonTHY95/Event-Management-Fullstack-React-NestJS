import { Body, Controller , HttpException, HttpStatus, Post, Res} from '@nestjs/common';
import { SignUpDTO, LoginDTO} from '../DTO/DTO';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';

import { Response } from 'express';

@Controller('user')
export class UserController {

    constructor(private userService : UserService, private authServer : AuthService) {}

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
            const { accessToken, refreshToken } = await this.authServer.generateTokens(loginUser.email);
            response.cookie('access_token', accessToken, {
                httpOnly: true,
                // secure: true,
                // sameSite: 'strict',
                // path: '/auth/refresh',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });
            response.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                // secure: true,
                // sameSite: 'strict',
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
        console.error("Inside Logout ");
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return { message: 'Logged out' };
    }
}
