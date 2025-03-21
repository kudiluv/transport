import { Point } from 'typeorm';
import { VehiclePosition } from '../vehicle-position.entity';
import { Vehicle } from 'vehicle/vehicle.entity';
import { HistoryTimestamp } from 'history-timestamp/history-timestamp.entity';
import { RouteDirection } from 'route-direction/route-direction.entity';

export class VehiclePositionCreateDto {
    vehicle: Vehicle;
    position: Point;
    speed: number;
    rotation: number;
    prevPosition?: VehiclePosition | null;
    routeDirection: RouteDirection | null;
    historyTimestamp: HistoryTimestamp;
}
