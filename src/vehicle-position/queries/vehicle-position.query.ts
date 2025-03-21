import { Route } from 'routes/route.entity';
import { Point, Repository } from 'typeorm';
import { VehiclePosition } from 'vehicle-position/vehicle-position.entity';

export class VehiclePositionQuery {
    private query;
    constructor(repo: Repository<VehiclePosition>) {
        this.query = repo
            .createQueryBuilder('vehiclePosition')
            .leftJoinAndSelect('vehiclePosition.vehicle', 'vehicle')
            .leftJoinAndSelect('vehiclePosition.routeDirection', 'routeDirection')
            .leftJoinAndSelect('routeDirection.route', 'route');
    }

    public addWhereByHistoryTimestampId(historyTimestampId: number) {
        this.query = this.query.where('vehiclePosition.historyTimestampId = :historyTimestampId', {
            historyTimestampId,
        });
        return this;
    }

    public addWhereByRouteIds(routeIds: number[]) {
        this.query.andWhere('route.id IN (:...ids)', {
            ids: routeIds,
        });

        return this;
    }

    public addSortByDistance(point: Point, order?: 'ASC' | 'DESC') {
        this.query
            .addSelect(`ST_Distance(vehiclePosition.coordinates, ST_GeomFromGeoJSON(:position))`, 'distance')
            .setParameter('position', point)
            .orderBy('distance', order);
    }

    public addLimit(limit: number) {
        this.query = this.query.limit(limit);
        return this;
    }

    execMany(): Promise<VehiclePosition[]> {
        return this.query.getMany();
    }
}
