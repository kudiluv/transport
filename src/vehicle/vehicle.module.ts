import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vehicle])],
    providers: [VehicleService],
    exports: [VehicleService],
})
export class VehicleModule {}
