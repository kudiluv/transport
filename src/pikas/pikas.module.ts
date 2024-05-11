import { Module } from '@nestjs/common';
import { PikasService } from './pikas.service';

@Module({
  providers: [PikasService],
  exports: [PikasService],
})
export class PikasModule {}
