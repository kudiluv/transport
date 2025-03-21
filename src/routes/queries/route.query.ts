import { Route } from 'routes/route.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

export enum RouteQueryRelation {
    DIRECTIONS = 'directions',
    BUS_STATIONS = 'busStations',
}

export class RouteQuery {
    private query: SelectQueryBuilder<Route>;
    constructor(repo: Repository<Route>) {
        this.query = repo.createQueryBuilder('route');
    }

    leftJoinDirections() {
        this.query.leftJoinAndSelect('route.directions', 'routeDirection');
        return this;
    }

    leftJoinBusStations() {
        this.query.leftJoinAndSelect('routeDirection.busStations', 'busStations');
        return this;
    }

    execMany(): Promise<Route[]> {
        return this.query.getMany();
    }
}
