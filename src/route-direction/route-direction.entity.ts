import { GeometryColumn, StringColumn } from 'common/decorators/db-decorators';
import { Entity, JoinTable, LineString, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Route } from '../routes/route.entity';
import { BusStation } from '../bus-stations/bus-station.entity';
import { VehiclePosition } from '../vehicle-position/vehicle-position.entity';

@Entity()
export class RouteDirection {
    @PrimaryGeneratedColumn()
    id: number;

    @StringColumn('Name of direction')
    name: string;

    @StringColumn('Type of direction')
    type: string;

    @GeometryColumn('Coordinates of direction')
    coordinates: LineString;

    @ManyToOne(() => Route, (route) => route.directions)
    route: Route;

    @ManyToMany(() => BusStation, (busStations) => busStations.routeDirections, { cascade: true })
    @JoinTable()
    busStations: BusStation[];

    @OneToMany(() => VehiclePosition, (vehiclePosition) => vehiclePosition.routeDirection)
    vehiclePositions: VehiclePosition[];
}
