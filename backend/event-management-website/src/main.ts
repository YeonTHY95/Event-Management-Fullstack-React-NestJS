import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // origin: ['http://localhost:5173',], 
    // origin: true, 
    // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // allowedHeaders: ['*'],
    // credentials: true,              // allow cookies and headers
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // preflightContinue: false,
    credentials: true,
    // allowedHeaders: 'Content-Type, Accept',
  });
  app.use(cookieParser()); 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap(); 
