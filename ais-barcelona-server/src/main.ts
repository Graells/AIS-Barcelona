import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const SERVER_PORT = process.env.SERVER_PORT || 3000;
  await app.listen(SERVER_PORT, () =>
    new Logger('SERVER').log(`Server Running on port: ${SERVER_PORT}`),
  );
}
bootstrap();
