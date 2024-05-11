import { Module } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ParserController } from './parser.controller';
import { RoutesModule } from 'src/routes/routes.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { VehiclePositionModule } from 'src/vehicle-position/vehicle-position.module';
// import { RouteParserService } from '../routes/route-parser.service';
import { HttpModule } from '@nestjs/axios';
import { BusStationsModule } from 'src/bus-stations/bus-stations.module';
import { PikasModule } from 'src/pikas/pikas.module';

@Module({
  providers: [ParserService],
  controllers: [ParserController],
  imports: [
    RoutesModule,
    VehicleModule,
    VehiclePositionModule,
    HttpModule,
    BusStationsModule,
    PikasModule,
  ],
})
export class ParserModule {}
