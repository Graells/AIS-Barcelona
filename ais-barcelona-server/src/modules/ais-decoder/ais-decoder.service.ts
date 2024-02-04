import { Injectable } from '@nestjs/common';
import { AisDataService } from './services/ais-data.service';
import { DataProcessingService } from './services/data-processing.service';

@Injectable()
export class AisDecoderService {
  constructor(
    private aisDataService: AisDataService,
    private dataProcessingService: DataProcessingService,
  ) {}

  public async decodeAisMessages(): Promise<any> {
    const aisData = await this.aisDataService.fetchDecodedMessages();
    return this.dataProcessingService.processData(aisData);
  }
}
