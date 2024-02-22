import { Injectable } from '@nestjs/common';
import { AisDataFetchService } from './services/ais-data-fetch.service';
import { DataProcessingService } from './services/data-processing.service';
import { VesselData } from './dto/vesselData';
import { TagsDataFetchService } from './services/tags-data-fetch.service';
import { TagsProcessingService } from './services/tags-processing.service';

@Injectable()
export class AisDecoderService {
  constructor(
    private aisDataFetchService: AisDataFetchService,
    private dataProcessingService: DataProcessingService,
    private tagsDataFetchService: TagsDataFetchService,
    private tagsProcessingService: TagsProcessingService,
  ) {}

  public async decodeAisMessages(): Promise<VesselData[]> {
    const aisData =
      await this.aisDataFetchService.fetchDecodedMessagesFromPyais();
    return this.dataProcessingService.processData(aisData);
  }
  public async decodeAisTags(): Promise<any[]> {
    const aisData = await this.tagsDataFetchService.fetchDecodedTagsFromPyais();
    return this.tagsProcessingService.processSentences(aisData);
  }
}
