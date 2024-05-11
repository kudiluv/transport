import { HistoryTimestamp } from 'src/history-timestamp/history-timestamp.entity';
import { Vehicle } from 'src/vehicle/vehicle.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  Point,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoutePosition } from './enum/route-position';

@Entity()
export class VehiclePosition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'geometry' })
  position: Point;

  @Column()
  speed: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.positions)
  vehicle: Vehicle;

  @Index('history_timestamp_id')
  @ManyToOne(() => HistoryTimestamp, (historyTimestamp) => historyTimestamp)
  historyTimestamp: HistoryTimestamp;

  @Column()
  rotation: number;

  @Index('prev_position_id')
  @ManyToOne(() => VehiclePosition, { nullable: true })
  prevPosition: VehiclePosition;

  @Column({ type: 'enum', enum: RoutePosition, default: RoutePosition.IDLE })
  route_position: RoutePosition;
}
