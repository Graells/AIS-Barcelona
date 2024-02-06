import { Injectable } from '@nestjs/common';
import { AisDataService } from './services/ais-data.service';
import { DataProcessingService } from './services/data-processing.service';
import { VesselData } from './dto/vesselData';

@Injectable()
export class AisDecoderService {
  constructor(
    private aisDataService: AisDataService,
    private dataProcessingService: DataProcessingService,
  ) {}

  public async decodeAisMessages(): Promise<VesselData[]> {
    const aisData = await this.aisDataService.fetchDecodedMessages();
    return this.dataProcessingService.processData(aisData);
  }
}
