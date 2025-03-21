import { RouteDirection } from 'route-direction/route-direction.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

export class RouteDirectionQuery {
    private query: SelectQueryBuilder<RouteDirection>;
    constructor(repo: Repository<RouteDirection>) {
        this.query = repo
            .createQueryBuilder('routeDirection')
            .leftJoinAndSelect('routeDirection.busStations', 'busStations')
            .leftJoinAndSelect('routeDirection.route', 'route');
    }

    execMany(): Promise<RouteDirection[]> {
        return this.query.getMany();
    }
}
