import { Controller, Get } from '@nestjs/common';
import { AisDecoderService } from './modules/ais-decoder/ais-decoder.service';

@Controller()
export class AppController {
  constructor(private readonly aisDecoderService: AisDecoderService) {}

  @Get('/decode-ais-messages')
  decodeAisMessages(): any {
    return this.aisDecoderService.decodeAisMessages();
  }

  @Get('/decode-ais-tags')
  decodeAisTags(): any {
    return this.aisDecoderService.decodeAisTags();
  }

  @Get('/')
  getHello(): string {
    return 'Hello World!';
  }
}
