import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AisDataService {
  constructor(private httpService: HttpService) {}

  public async fetchDecodedMessages(): Promise<any> {
    const pythonServiceUrl = 'http://127.0.0.1:5000/get-decoded-json';
    const response$ = this.httpService.get(pythonServiceUrl);
    const response = await lastValueFrom(response$);
    return response.data; // Return the data directly from the external service
  }
}
