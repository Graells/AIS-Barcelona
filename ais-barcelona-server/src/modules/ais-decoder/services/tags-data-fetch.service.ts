import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TagsDataFetchService {
  private pythonServiceUrl: string;

  constructor(
    private httpService: HttpService,
    configService: ConfigService,
  ) {
    this.pythonServiceUrl =
      configService.get<string>('AIS_PYTHON_SERVER_URL') ||
      'http://127.0.0.1:5000/get-decoded-2448'; // get-decoded-tags
  }

  public async fetchDecodedTagsFromPyais(): Promise<any[]> {
    console.log('python server url', this.pythonServiceUrl);
    const response$ = this.httpService.get(this.pythonServiceUrl);
    const response = await lastValueFrom(response$);
    return response.data;
  }
}
