import { Module } from '@nestjs/common';
import { BusStationsService } from './bus-stations.service';
import { BusStationsController } from './bus-stations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusStation } from './bus-station.entity';
import { BusStationsParserService } from './bus-stations-parser.service';
import { PikasModule } from 'src/pikas/pikas.module';

@Module({
  imports: [TypeOrmModule.forFeature([BusStation]), PikasModule],
  providers: [BusStationsService, BusStationsParserService],
  controllers: [BusStationsController],
  exports: [BusStationsParserService],
})
export class BusStationsModule {}
