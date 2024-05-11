import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleParserService } from './vehicle-parser.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  providers: [VehicleService, VehicleParserService],
  exports: [VehicleService, VehicleParserService],
})
export class VehicleModule {}
