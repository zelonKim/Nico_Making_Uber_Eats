import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtMiddleware } from './jwt/jwt.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.use(JwtMiddleware)  // 애플리케이션 전체에 해당 미들웨어를 적용함. (단, 함수 방식 미들웨어만 가능)
  await app.listen(3000);
}
bootstrap();
