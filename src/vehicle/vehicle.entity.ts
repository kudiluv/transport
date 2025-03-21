import { StringColumn } from 'common/decorators/db-decorators';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VehiclePosition } from '../vehicle-position/vehicle-position.entity';

@Entity()
export class Vehicle {
    @PrimaryGeneratedColumn()
    id: number;

    @StringColumn('Registration number')
    regNumber: string;

    @OneToMany(() => VehiclePosition, (position) => position.vehicle)
    positions: VehiclePosition[];
}
