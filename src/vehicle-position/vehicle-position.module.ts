import { Module } from '@nestjs/common';
import { VehiclePositionService } from './vehicle-position.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclePosition } from './vehicle-position.entity';
import { VehiclePositionController } from './vehicle-position.controller';
import { HistoryTimestampModule } from 'src/history-timestamp/history-timestamp.module';
import { RoutesModule } from 'src/routes/routes.module';
import { VehiclePositionParserService } from './verhicle-position-parser.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VehiclePosition]),
    HistoryTimestampModule,
    RoutesModule,
  ],
  providers: [VehiclePositionService, VehiclePositionParserService],
  exports: [VehiclePositionService, VehiclePositionParserService],
  controllers: [VehiclePositionController],
})
export class VehiclePositionModule {}
