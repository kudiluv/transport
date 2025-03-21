import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BusStationsModule } from 'bus-stations/bus-stations.module';
import { PikasModule } from 'pikas/pikas.module';
import { RoutesModule } from 'routes/routes.module';
import { VehiclePositionModule } from 'vehicle-position/vehicle-position.module';
import { VehicleModule } from 'vehicle/vehicle.module';
import { BusStationsParserService } from './bus-stations-parser.service';
import { RouteParserService } from './route-parser.service';
import { RouteDirectionModule } from 'route-direction/route-direction.module';
import { VehiclePositionParserService } from './verhicle-position-parser.service';
import { HistoryTimestampModule } from 'history-timestamp/history-timestamp.module';
import { BullModule } from '@nestjs/bullmq';
import {
    PARSING_BUS_STATIONS_QUEUE,
    PARSING_ROUTE_QUEUE,
    PARSING_VEHICLE_POSITIONS_QUEUE,
} from './constants/queue-names';

@Module({
    providers: [BusStationsParserService, RouteParserService, VehiclePositionParserService],
    controllers: [],
    imports: [
        RoutesModule,
        VehicleModule,
        VehiclePositionModule,
        HttpModule,
        BusStationsModule,
        PikasModule,
        RouteDirectionModule,
        HistoryTimestampModule,
        BullModule.registerQueue(
            { name: PARSING_BUS_STATIONS_QUEUE },
            { name: PARSING_ROUTE_QUEUE },
            { name: PARSING_VEHICLE_POSITIONS_QUEUE },
        ),
    ],
})
export class ParserModule {}
