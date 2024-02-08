import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AisDecoderService } from './ais-decoder.service';
import { DataProcessingService } from './services/data-processing.service';
import { AisDataFetchService } from './services/ais-data-fetch.service';

@Module({
  imports: [HttpModule],
  providers: [AisDecoderService, DataProcessingService, AisDataFetchService],
  exports: [AisDecoderService],
})
export class AisDecoderModule {}
