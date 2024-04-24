import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AisDecoderService } from './ais-decoder.service';
import { TagsDataFetchService } from './services/tags-data-fetch.service';
import { TagsProcessingService } from './services/tags-processing.service';

@Module({
  imports: [HttpModule],
  providers: [AisDecoderService, TagsDataFetchService, TagsProcessingService],
  exports: [AisDecoderService],
})
export class AisDecoderModule {}
