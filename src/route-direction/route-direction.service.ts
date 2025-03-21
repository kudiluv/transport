import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RouteDirectionQuery } from './queries/route-direction.query';
import { Repository } from 'typeorm';
import { RouteDirection } from './route-direction.entity';
import { CreateRouteDirectionParams } from './types/create-route-direction-params.type';

@Injectable()
export class RouteDirectionService {
    constructor(
        @InjectRepository(RouteDirection)
        private readonly repository: Repository<RouteDirection>,
    ) {}

    public getAll(): Promise<RouteDirection[]> {
        return new RouteDirectionQuery(this.repository).execMany();
    }

    public create(params: CreateRouteDirectionParams) {
        const routeDirection = this.repository.create({
            busStations: params.busStations,
            coordinates: params.coordinates,
            name: params.name,
            type: params.type,
        });

        return this.repository.save(routeDirection);
    }

    public async update(routeDirection: RouteDirection, params: Partial<RouteDirection>): Promise<RouteDirection> {
        return await this.repository.save(Object.assign(routeDirection, params));
    }
}
