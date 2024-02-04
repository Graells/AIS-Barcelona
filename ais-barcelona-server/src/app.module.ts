import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AisDecoderModule } from './modules/ais-decoder/ais-decoder.module';

@Module({
  imports: [AisDecoderModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
