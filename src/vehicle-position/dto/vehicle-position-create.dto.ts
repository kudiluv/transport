import { HistoryTimestamp } from 'src/history-timestamp/history-timestamp.entity';
import { Vehicle } from 'src/vehicle/vehicle.entity';
import { Point } from 'typeorm';
import { VehiclePosition } from '../vehicle-position.entity';

export class VehiclePositionCreateDto {
  vehicle: Vehicle;
  position: Point;
  speed: number;
  rotation: number;
  prevPosition?: VehiclePosition;
  historyTimestamp: HistoryTimestamp;
}
