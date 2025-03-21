import { GeometryColumn, IntColumn } from 'common/decorators/db-decorators';
import { Entity, ManyToOne, Point, PrimaryGeneratedColumn } from 'typeorm';
import { RouteDirection } from '../route-direction/route-direction.entity';
import { HistoryTimestamp } from '../history-timestamp/history-timestamp.entity';
import { Vehicle } from '../vehicle/vehicle.entity';

@Entity()
export class VehiclePosition {
    @PrimaryGeneratedColumn()
    id: number;

    @GeometryColumn('Coordinates of vehicle')
    coordinates: Point;

    @IntColumn('Speed of vehicle')
    speed: number;

    @IntColumn('Rotation of vehicle')
    rotation: number;

    @ManyToOne(() => RouteDirection, (routeDirection) => routeDirection.vehiclePositions)
    routeDirection: RouteDirection | null;

    @ManyToOne(() => Vehicle, (vehicle) => vehicle.positions)
    vehicle: Vehicle;

    @ManyToOne(() => HistoryTimestamp, (historyTimestamp) => historyTimestamp.vehiclePositions)
    historyTimestamp: HistoryTimestamp;
}
