import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AisDecoderService } from './ais-decoder.service';
import { DataProcessingService } from './services/data-processing.service';
import { AisDataFetchService } from './services/ais-data-fetch.service';
import { TagsDataFetchService } from './services/tags-data-fetch.service';
import { TagsProcessingService } from './services/tags-processing.service';

@Module({
  imports: [HttpModule],
  providers: [
    AisDecoderService,
    DataProcessingService,
    AisDataFetchService,
    TagsDataFetchService,
    TagsProcessingService,
  ],
  exports: [AisDecoderService],
})
export class AisDecoderModule {}
