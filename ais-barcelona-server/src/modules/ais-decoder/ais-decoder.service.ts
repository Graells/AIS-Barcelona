import { Injectable } from '@nestjs/common';
import { TagsDataFetchService } from './services/tags-data-fetch.service';
import { TagsProcessingService } from './services/tags-processing.service';

@Injectable()
export class AisDecoderService {
  constructor(
    private tagsDataFetchService: TagsDataFetchService,
    private tagsProcessingService: TagsProcessingService,
  ) {}

  public async decodeAisTags(): Promise<any[]> {
    const aisData = await this.tagsDataFetchService.fetchDecodedTagsFromPyais();
    return this.tagsProcessingService.processSentences(aisData);
  }
}
