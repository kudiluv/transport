import { Module } from '@nestjs/common';
import { VehiclePositionService } from './vehicle-position.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclePositionController } from './vehicle-position.controller';
import { VehiclePosition } from './vehicle-position.entity';
import { HistoryTimestampModule } from 'history-timestamp/history-timestamp.module';

@Module({
    imports: [TypeOrmModule.forFeature([VehiclePosition]), HistoryTimestampModule],
    providers: [VehiclePositionService],
    exports: [VehiclePositionService],
    controllers: [VehiclePositionController],
})
export class VehiclePositionModule {}
