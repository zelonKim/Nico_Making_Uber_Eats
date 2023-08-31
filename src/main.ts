import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // Dto에 존재하는 프로퍼티만 추가할 수 있도록 해줌.
      transform: true, // 보내진 데이터를 실제 타입으로 변환해줌.
    }),
  );
  await app.listen(3000);
}
bootstrap();
