import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AisDecoderModule } from './modules/ais-decoder/ais-decoder.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    AisDecoderModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
