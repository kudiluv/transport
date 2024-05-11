import { VehiclePosition } from 'src/vehicle-position/vehicle-position.entity';
import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class HistoryTimestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @OneToMany(() => VehiclePosition, (position) => position.historyTimestamp)
  vehiclePosition: VehiclePosition;
}
