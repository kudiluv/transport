import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BusStation } from 'src/bus-stations/bus-station.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './route.entity';
import * as _ from 'lodash';
import { LogPerfomance } from 'src/shared/decorators/log-pefomance';
import { PikasService } from 'src/pikas/pikas.service';

@Injectable()
export class RouteParserService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    private pikasService: PikasService,
  ) {}

  @LogPerfomance({
    start: (context) =>
      Logger.debug('Start parsing routes', context.constructor.name),
    end: (time, context) =>
      Logger.debug(
        `Finished parsing routes (speed: ${time} c)`,
        context.constructor.name,
      ),
  })
  public async parse(busStations?: BusStation[]) {
    const parsedRoutes = await this.pikasService.getRoutes();
    const existedRoutes = await this.routeRepository
      .createQueryBuilder('route')
      .addSelect('route.AB')
      .addSelect('route.BA')
      .getMany();

    const routesForCreating = await parsedRoutes.filter(
      ({ routeNum, type }) => {
        return !existedRoutes.some(
          (r) => r.routeNum === routeNum && r.type === type,
        );
      },
    );

    for (const route of routesForCreating) {
      const routePaths = await this.pikasService.getRoutePaths(
        route.type,
        route.routeNum,
      );
      const routeEntity = this.routeRepository.create({
        type: route.type,
        routeNum: route.routeNum,
        AB: routePaths.AB,
        BA: routePaths.BA,
        ABName: route.abName,
        BAName: route.baName,
        ABStations: route.ABStations,
        BAStations: route.BAStations,
      });
      const savedRoute = await this.routeRepository.save(routeEntity);
      existedRoutes.push(savedRoute);
    }

    return existedRoutes;
  }
}
