import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehiclePosition } from './vehicle-position.entity';
import { EntityManager, Repository } from 'typeorm';
import { ParsedVehiclePositionDto } from 'src/pikas/dto/parsed-vehicle-position.dto';
import { Route } from 'src/routes/route.entity';
import { RoutePosition } from './enum/route-position';
import { getDistance } from 'src/shared/helpers/get-distance';
import * as _ from 'lodash';
import { Vehicle } from 'src/vehicle/vehicle.entity';
import { VehiclePositionService } from './vehicle-position.service';
import { HistoryTimestampService } from 'src/history-timestamp/history-timestamp.service';
import { Transactional } from 'src/shared/decorators/transactional';

@Injectable()
export class VehiclePositionParserService {
  constructor(
    @InjectRepository(VehiclePosition)
    private vehiclePositionRepository: Repository<VehiclePosition>,
    private historyTimestampService: HistoryTimestampService,
    private vehiclePositionService: VehiclePositionService,
  ) {}

  @Transactional()
  public async parse(
    vehiclePositions: ParsedVehiclePositionDto[],
    vehicles: Vehicle[],
    routes: Route[],
    manager?: EntityManager,
  ) {
    const prevPositions = await this.vehiclePositionService.getAll();
    const historyTimestamp = await this.historyTimestampService.create(manager);

    const vehiclesMap = new Map([
      ...vehicles.map((vehicle): [string, Vehicle] => [
        `${vehicle.vehicleId}-${vehicle.route.type}-${vehicle.route.routeNum}`,
        vehicle,
      ]),
    ]);

    const prevPositionsMap = new Map([
      ...prevPositions.map((pos): [number, VehiclePosition] => [
        pos.vehicle.id,
        pos,
      ]),
    ]);
    const routesMap = new Map<string, Route>([
      ...routes.map((route): [string, Route] => [
        `${route.type}-${route.routeNum}`,
        route,
      ]),
    ]);

    const vehiclePositionsForAdd = vehiclePositions.filter((pos) => {
      return vehiclesMap.has(`${pos.grz}-${pos.routeType}-${pos.routeNum}`);
    });

    const newVehiclePositions = vehiclePositionsForAdd.map(
      (pos): VehiclePosition => {
        const vehicle = vehiclesMap.get(
          `${pos.grz}-${pos.routeType}-${pos.routeNum}`,
        );
        const prevPos = prevPositionsMap.get(vehicle.id);

        return this.vehiclePositionRepository.create({
          position: {
            type: 'Point',
            coordinates: pos.position,
          },
          rotation: pos.rotation,
          historyTimestamp,
          speed: pos.speed,
          vehicle,
          route_position: this.getRoutePosition(
            routesMap.get(`${pos.routeType}-${pos.routeNum}`),
            pos.position,
            prevPos,
          ),
          prevPosition: prevPos,
        });
      },
    );

    await manager.save(newVehiclePositions);
  }

  private getRoutePosition(
    route: Route,
    position: number[],
    prevPosition?: VehiclePosition,
  ) {
    const routeAB = route.AB.coordinates;
    const routeBA = route.BA.coordinates;

    const posABInfo = this.getInfoAboutPosition(
      routeAB,
      position,
      prevPosition,
    );

    const posBAInfo = this.getInfoAboutPosition(
      routeBA,
      position,
      prevPosition,
    );

    if (posABInfo.posIndex === posABInfo.prevPosIndex && prevPosition) {
      return prevPosition.route_position;
    }

    if (
      posABInfo.posIndex > posABInfo.prevPosIndex &&
      posABInfo.distance * 1000 < 70
    ) {
      return RoutePosition.AB;
    }
    if (
      posBAInfo.posIndex > posBAInfo.prevPosIndex &&
      posBAInfo.distance * 1000 < 70
    ) {
      return RoutePosition.BA;
    }

    return RoutePosition.IDLE;
  }

  private getInfoAboutPosition(
    route: number[][],
    position: number[],
    prevPosition?: VehiclePosition,
  ) {
    const pos = _.minBy(route, ([lng, lat]) => {
      return getDistance(lat, lng, position[1], position[0]);
    });

    const prevPos = prevPosition
      ? _.minBy(route, ([lng, lat]) => {
          return getDistance(
            lat,
            lng,
            prevPosition.position.coordinates[1],
            prevPosition.position.coordinates[0],
          );
        })
      : pos;

    const posIndex = route.indexOf(pos);
    const prevPosIndex = route.indexOf(prevPos);
    const distanceNearby = getDistance(
      pos[1],
      pos[0],
      position[1],
      position[0],
    );
    return {
      posIndex: posIndex,
      prevPosIndex: prevPosIndex,
      distance: distanceNearby,
    };
  }
}
