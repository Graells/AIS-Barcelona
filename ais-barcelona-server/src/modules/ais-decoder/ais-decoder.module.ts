import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AisDecoderService } from './ais-decoder.service';
import { DataProcessingService } from './services/data-processing.service';
import { AisDataService } from './services/ais-data.service';

@Module({
  imports: [HttpModule],
  providers: [AisDecoderService, DataProcessingService, AisDataService],
  exports: [AisDecoderService],
})
export class AisDecoderModule {}
