import { Injectable } from '@nestjs/common';

export interface Position {
  timestamp: string;
  lat: number;
  lon: number;
}

export type VesselData = {
  mmsi: number;
  name: string;
  lat: number | undefined;
  lon: number | undefined;
  lastUpdateTime: string | undefined;
  destination: string | undefined;
  callsign: string | undefined;
  speed: number | undefined;
  ship_type: number | undefined;
  positions: Position[];
};

@Injectable()
export class TagsProcessingService {
  private vessels: Map<number, VesselData> = new Map();

  constructor() {}

  processSentences(sentences: any[]): VesselData[] {
    sentences.forEach((sentence) => {
      let vesselData = this.vessels.get(sentence.mmsi);
      if (!vesselData) {
        vesselData = {
          mmsi: sentence.mmsi,
          name: '',
          lat: undefined,
          lon: undefined,
          lastUpdateTime: undefined,
          destination: undefined,
          callsign: undefined,
          speed: undefined,
          ship_type: undefined,
          positions: [],
        };
        this.vessels.set(sentence.mmsi, vesselData);
      }

      this.updateVesselDataWithSentence(vesselData, sentence);
    });

    this.vessels.forEach((vesselData) => {
      this.updateVesselWithLatestPosition(vesselData);
    });

    return Array.from(this.vessels.values());
  }

  private updateVesselDataWithSentence(vesselData: VesselData, sentence: any) {
    if ('lat' in sentence && 'lon' in sentence) {
      vesselData.positions.push({
        timestamp: sentence.receiver_timestamp,
        lat: sentence.lat,
        lon: sentence.lon,
      });
    }

    if ('shipname' in sentence) {
      vesselData.name = sentence.shipname;
    }
    if ('destination' in sentence) {
      vesselData.destination = sentence.destination;
    }
    if ('callsign' in sentence) {
      vesselData.callsign = sentence.callsign;
    }
    if ('speed' in sentence) {
      vesselData.speed = sentence.speed;
    }
    if ('ship_type' in sentence) {
      vesselData.ship_type = sentence.ship_type;
    }
  }

  private updateVesselWithLatestPosition(vesselData: VesselData) {
    if (vesselData.positions.length === 0) return;

    const latestPosition = vesselData.positions.reduce((latest, current) => {
      return latest.timestamp > current.timestamp ? latest : current;
    }, vesselData.positions[0]);

    vesselData.lat = latestPosition.lat;
    vesselData.lon = latestPosition.lon;
    vesselData.lastUpdateTime = latestPosition.timestamp;
  }
}
