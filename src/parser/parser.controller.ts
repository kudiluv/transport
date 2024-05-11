import { Controller, Get } from '@nestjs/common';
import { ParserService } from './parser.service';

@Controller('parser')
export class ParserController {
  constructor(private parser: ParserService) {}

  @Get('/')
  parse() {
    return this.parser.parse();
  }
}
