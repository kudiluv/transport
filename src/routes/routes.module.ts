import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './route.entity';
import { PikasModule } from 'pikas/pikas.module';
import { RouteDirection } from '../route-direction/route-direction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Route, RouteDirection]), PikasModule],
    providers: [RouteService],
    controllers: [RoutesController],
    exports: [RouteService],
})
export class RoutesModule {}
