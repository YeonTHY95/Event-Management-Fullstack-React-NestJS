import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma'; // Adjust the import path as necessary

@Injectable()
export class AuthService {

    constructor(private jwt: JwtService, private prisma: PrismaService) {}

    async generateTokens(email: string) {
        const [accessToken, refreshToken] = await Promise.all([
        this.jwt.signAsync({ sub:  email }, { expiresIn: '60s', secret: process.env.ACCESS_TOKEN_SECRET }),
        this.jwt.signAsync({ sub:  email }, { expiresIn: '15m', secret: process.env.REFRESH_TOKEN_SECRET }),
        ]);
        return { accessToken, refreshToken };
    }

    async refreshAccessToken( refreshToken: string) {
        // Verify if the refresh token is valid
        const payload = await this.jwt.verifyAsync(
            refreshToken,
            {
                secret: process.env.REFRESH_TOKEN_SECRET,
            }
        );

        console.log("Inside updateRefreshToken, after verifyAsync payload is: ", payload);
        // const test = email === payload.sub;
        console.log("Payload Test result: ", test);
        if (!payload) {
            throw new Error('Invalid refresh token');
        }
        const renewedAccessToken = await this.jwt.signAsync({ sub:  payload.email }, { expiresIn: '60s', secret: process.env.ACCESS_TOKEN_SECRET });
        return renewedAccessToken;
    }

    async validateRefreshToken(email: string, refreshToken: string) {
        const payload = await this.jwt.verifyAsync(
            refreshToken,
            {
                secret: process.env.REFRESH_TOKEN_SECRET ,
            }
        );
        console.log("Inside validateRefreshToken, after verifyAsync payload is: ", payload);
        if (!payload) {
            throw new Error('Invalid refresh token');
        }
        else return true;
    }
}

