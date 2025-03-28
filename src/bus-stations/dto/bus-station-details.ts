import { Route } from 'routes/route.entity';
import { Point } from 'typeorm';

export type BusStationDetails = {
    id: string;
    position: Point;
    name: string;
    routes: Route[];
};
