import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './user';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [User, UserService]
})
export class UserModule {}
