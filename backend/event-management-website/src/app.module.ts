import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [UserModule,ConfigModule.forRoot(), PrismaModule, AuthModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
