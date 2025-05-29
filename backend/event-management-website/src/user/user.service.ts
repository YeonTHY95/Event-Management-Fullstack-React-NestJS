import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDTO,LoginDTO } from 'src/DTO/DTO';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma';
// import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {

    constructor(private prisma : PrismaService) {}

    async signUp(data: SignUpDTO): Promise<User> {
        const { email, password, role } = data;
        const hashPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: {
                email,
                password : hashPassword,
                isAdmin: role === 'admin' ? true : false,
            }
        });
    }

    async login(data: LoginDTO): Promise<User> {
        const { email, password } = data;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {    
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        return user;    
    }

    async verifyPassword(email: string, password: string) {

        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        return true;
    }


}
