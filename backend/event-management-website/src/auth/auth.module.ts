import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Prisma } from 'generated/prisma';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [AuthService],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    PrismaModule
  ],
  exports: [AuthService],
})
export class AuthModule {


}
