import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/decode-ais-messages')
  decodeAisMessages(): any {
    return this.appService.decodeAisMessages();
  }
}
