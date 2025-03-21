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
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DataSource } from 'typeorm';
import { RouteDirectionModule } from 'route-direction/route-direction.module';
import { EnvModule } from 'env/env.module';
import { BullModule } from './bull.module';

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
        RouteDirectionModule,
        EnvModule,
        ClsModule.forRoot({
            plugins: [
                new ClsPluginTransactional({
                    imports: [
                        // module in which the database instance is provided
                        TypeOrmModule,
                    ],
                    adapter: new TransactionalAdapterTypeOrm({
                        // the injection token of the database instance
                        dataSourceToken: DataSource,
                    }),
                }),
            ],
        }),
        BullModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
