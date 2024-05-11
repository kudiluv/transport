import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParserModule } from './parser/parser.module';
import { BusStationsModule } from './bus-stations/bus-stations.module';
import { RoutesModule } from './routes/routes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from './ormconfig';
import { VehicleModule } from './vehicle/vehicle.module';
import { VehiclePositionModule } from './vehicle-position/vehicle-position.module';
import { HistoryTimestampModule } from './history-timestamp/history-timestamp.module';
import { TensorModule } from './tensor/tensor.module';
import { RouteSpeedInfoModule } from './route-speed-info/route-speed-info.module';
import { PikasModule } from './pikas/pikas.module';

@Module({
  imports: [
    ParserModule,
    BusStationsModule,
    RoutesModule,
    TypeOrmModule.forRoot(ormconfig),
    VehicleModule,
    VehiclePositionModule,
    HistoryTimestampModule,
    TensorModule,
    RouteSpeedInfoModule,
    PikasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
