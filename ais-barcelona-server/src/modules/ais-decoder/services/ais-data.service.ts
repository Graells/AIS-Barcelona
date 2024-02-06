import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { Sentence } from '../dto/sentence';

@Injectable()
export class AisDataService {
  private pythonServiceUrl: string;

  constructor(
    private httpService: HttpService,
    configService: ConfigService,
  ) {
    this.pythonServiceUrl =
      configService.get<string>('ais.pythonServerUrl') ||
      'http://127.0.0.1:5000/get-decoded-json';
  }

  public async fetchDecodedMessages(): Promise<Sentence[]> {
    const response$ = this.httpService.get(this.pythonServiceUrl);
    const response = await lastValueFrom(response$);
    return response.data;
  }
}
