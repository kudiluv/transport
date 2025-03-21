import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { RouteSpeedInfoView } from './route-speed-info.view';
// import { RouteSpeedInfoService } from './route-speed-info.service';

@Module({
    // imports: [TypeOrmModule.forFeature([RouteSpeedInfoView])],
    // providers: [RouteSpeedInfoService],
})
export class RouteSpeedInfoModule {}
