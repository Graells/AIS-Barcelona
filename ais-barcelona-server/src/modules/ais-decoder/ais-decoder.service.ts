import { Injectable } from '@nestjs/common';
import { AisDataFetchService } from './services/ais-data-fetch.service';
import { DataProcessingService } from './services/data-processing.service';
import { VesselData } from './dto/vesselData';

@Injectable()
export class AisDecoderService {
  constructor(
    private aisDataFetchService: AisDataFetchService,
    private dataProcessingService: DataProcessingService,
  ) {}

  public async decodeAisMessages(): Promise<VesselData[]> {
    const aisData =
      await this.aisDataFetchService.fetchDecodedMessagesFromPyais();
    return this.dataProcessingService.processData(aisData);
  }
}
