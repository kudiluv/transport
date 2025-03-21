import { GeometryColumn, StringColumn } from 'common/decorators/db-decorators';
import { RouteDirection } from 'route-direction/route-direction.entity';
import { Entity, ManyToMany, Point, PrimaryColumn } from 'typeorm';

@Entity()
export class BusStation {
    @PrimaryColumn()
    id: string;

    @GeometryColumn('Coordinates of bus station')
    coordinates: Point;

    @StringColumn('Name of bus station')
    name: string;

    @ManyToMany(() => RouteDirection, (route) => route.busStations)
    routeDirections?: RouteDirection[];
}
