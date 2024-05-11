import { Route } from 'src/routes/route.entity';
import { VehiclePosition } from 'src/vehicle-position/vehicle-position.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicleId: string;

  @ManyToOne(() => Route, (route) => route.vehicles)
  route: Route;

  @OneToMany(
    () => VehiclePosition,
    (vehiclePosition) => vehiclePosition.vehicle,
  )
  positions: VehiclePosition[];
}
