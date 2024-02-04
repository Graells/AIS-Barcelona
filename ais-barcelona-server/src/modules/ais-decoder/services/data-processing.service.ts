import { Injectable } from '@nestjs/common';

@Injectable()
export class DataProcessingService {
  private padWithZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  private formatDate(dateInfo: any): string {
    if (!dateInfo) {
      return 'Unknown Time';
    }

    const { day, month, year, hour, minute, second } = dateInfo;
    if (
      day !== undefined &&
      month !== undefined &&
      year !== undefined &&
      hour !== undefined &&
      minute !== undefined &&
      second !== undefined
    ) {
      const formattedDay = this.padWithZero(day);
      const formattedMonth = this.padWithZero(month);
      const formattedHour = this.padWithZero(hour);
      const formattedMinute = this.padWithZero(minute);
      const formattedSecond = this.padWithZero(second);
      return `${year}-${formattedMonth}-${formattedDay} ${formattedHour}:${formattedMinute}:${formattedSecond}`;
    }

    return 'Unknown Time';
  }

  private getMoreRecentMessage(msg1, msg2) {
    const hasValidCoords = (msg) =>
      msg.lon !== undefined && msg.lat !== undefined;

    const date1 = new Date(
      msg1.year,
      msg1.month - 1,
      msg1.day,
      msg1.hour,
      msg1.minute,
      msg1.second,
    );
    const date2 = new Date(
      msg2.year,
      msg2.month - 1,
      msg2.day,
      msg2.hour,
      msg2.minute,
      msg2.second,
    );

    if (hasValidCoords(msg2) && (!hasValidCoords(msg1) || date1 < date2)) {
      return msg2;
    }
    return msg1;
  }

  public processData(aisData: any[]): any[] {
    const mmsiDataMap = new Map<
      number,
      { latestMessage: any; messages: any[] }
    >();

    aisData.forEach((data) => {
      const mmsi = data.mmsi;
      if (!mmsiDataMap.has(mmsi)) {
        mmsiDataMap.set(mmsi, { latestMessage: data, messages: [data] });
      } else {
        const existing = mmsiDataMap.get(mmsi);
        existing.latestMessage = this.getMoreRecentMessage(
          existing.latestMessage,
          data,
        );
        existing.messages.push(data);
        if (existing.messages.length > 10) {
          existing.messages.shift();
        }
      }
    });

    const result = [];
    mmsiDataMap.forEach(({ latestMessage, messages }, mmsi) => {
      const vesselInfo = messages.find((msg) => msg.msg_type === 5) || {};
      // const lastUpdateTime = `${latestMessage.year}-${latestMessage.month}-${latestMessage.day} ${latestMessage.hour}:${latestMessage.minute}:${latestMessage.second}`;

      result.push({
        mmsi: mmsi,
        lat: latestMessage.lat,
        lon: latestMessage.lon,
        lastUpdateTime: this.formatDate(latestMessage),
        name: vesselInfo.shipname || 'Unknown',
        destination: vesselInfo.destination,
        callsign: vesselInfo.callsign,
        speed: latestMessage.speed,
        ship_type: vesselInfo.ship_type,
        lastPositions: messages.map((msg) => ({ lat: msg.lat, lon: msg.lon })),
      });
    });

    return result;
  }
}
