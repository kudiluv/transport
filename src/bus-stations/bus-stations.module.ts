import { Module } from '@nestjs/common';
import { BusStationsService } from './bus-stations.service';
import { BusStationsController } from './bus-stations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusStation } from './bus-station.entity';
import { PikasModule } from 'pikas/pikas.module';

@Module({
    imports: [TypeOrmModule.forFeature([BusStation]), PikasModule],
    providers: [BusStationsService],
    controllers: [BusStationsController],
    exports: [BusStationsService],
})
export class BusStationsModule {}
