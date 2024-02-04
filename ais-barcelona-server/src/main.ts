import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const SERVER_PORT = configService.get<number>('SERVER_PORT', 3001);

  await app.listen(SERVER_PORT, () =>
    new Logger('SERVER').log(`Server Running on port: ${SERVER_PORT}`),
  );
}
bootstrap();
