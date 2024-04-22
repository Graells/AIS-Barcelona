import { Controller, Get } from '@nestjs/common';
import { AisDecoderService } from './modules/ais-decoder/ais-decoder.service';

@Controller()
export class AppController {
  constructor(private readonly aisDecoderService: AisDecoderService) {}

  @Get('/decode-2448') // ais-tags
  decodeAisTags(): any {
    return this.aisDecoderService.decodeAisTags();
  }

  @Get('/')
  getHello(): string {
    return 'Hello World!';
  }
}
