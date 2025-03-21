import { Module } from '@nestjs/common';
import { RouteDirectionService } from './route-direction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteDirection } from './route-direction.entity';

@Module({
    controllers: [],
    imports: [TypeOrmModule.forFeature([RouteDirection])],
    providers: [RouteDirectionService],
    exports: [RouteDirectionService],
})
export class RouteDirectionModule {}
