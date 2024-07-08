import { Injectable, NotFoundException } from '@nestjs/common';
import { Route } from './route.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RouteType } from './enums/RouteType';
import * as polyline from 'google-polyline';
import * as _ from 'lodash';
import { Transactional } from 'src/shared/decorators/transactional';
import { RouteCreateDto } from './dto/route-create.dto';
import { BusStation } from 'src/bus-stations/bus-station.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
  ) {}

  @Transactional()
  public async find(
    name: string,
    type: RouteType,
    entityManager?: EntityManager,
  ): Promise<Route> {
    return entityManager.findOne(Route, {
      where: {
        routeNum: name,
        type: type,
      },
    });
  }

  public async getRoutePath(id: number) {
    const route = await this.routeRepository.findOne({
      where: { id },
      select: ['AB', 'BA'],
    });
    if (!route) {
      throw new NotFoundException();
    }

    return polyline.encode([
      ...route.AB.coordinates,
      ...route.BA.coordinates,
    ] as any);
  }

  @Transactional()
  public async getABPath(id: number, entityManager?: EntityManager) {
    const route = await entityManager.findOne(Route, {
      where: { id },
      select: ['AB', 'BA'],
    });

    if (!route) {
      throw new NotFoundException();
    }

    return route;
  }

  public getAllRoutes() {
    return this.routeRepository.find({
      select: ['id', 'routeNum', 'type'],
    });
  }

  public async getRouteDetail(id: number) {
    const data = await this.routeRepository
      .createQueryBuilder('route')
      .leftJoinAndSelect('route.ABStations', 'abStations')
      .leftJoinAndSelect('route.BAStations', 'baStations')
      .addSelect(
        'ST_LineLocatePoint(route.AB, abStations.position)',
        'fraction',
      )
      .addSelect(
        'ST_LineLocatePoint(route.BA, baStations.position)',
        'fraction_ba',
      )
      .orderBy('fraction')
      .addOrderBy('fraction_ba')
      .where('route.id = :id', { id })
      .getOne();

    const paths = await this.routeRepository
      .createQueryBuilder('route')
      .select('route.AB')
      .addSelect('route.BA')
      .where('route.id = :id', { id })
      .getOne();

    return {
      ...data,
      ...paths,
    };
  }

  public async getRoutesGroupedByType() {
    const routes = await this.routeRepository
      .createQueryBuilder('route')
      .addOrderBy('type')
      .addOrderBy(`regexp_replace(route.routeNum, '\\D', '', 'g')::int`)
      .getMany();
    return routes;
  }
}
