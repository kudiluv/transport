import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './vehicle.entity';
import { ParsedVehiclePositionDto } from 'src/pikas/dto/parsed-vehicle-position.dto';
import { Route } from 'src/routes/route.entity';

@Injectable()
export class VehicleParserService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  public async parse(
    vehiclePositions: ParsedVehiclePositionDto[],
    routes: Route[],
  ): Promise<Vehicle[]> {
    const existVehicles = await this.getAllVehicles();
    const existVehiclesMap = new Map<string, Vehicle>([
      ...existVehicles.map((vehicle): [string, Vehicle] => [
        `${vehicle.vehicleId}-${vehicle.route.type}-${vehicle.route.routeNum}`,
        vehicle,
      ]),
    ]);

    const routesMap = new Map<string, Route>([
      ...routes.map((route): [string, Route] => [
        `${route.type}-${route.routeNum}`,
        route,
      ]),
    ]);

    const vehicleForCreate = vehiclePositions.filter(
      (vehicle) =>
        !existVehiclesMap.has(
          `${vehicle.grz}-${vehicle.routeType}-${vehicle.routeNum}`,
        ) && routesMap.has(`${vehicle.routeType}-${vehicle.routeNum}`),
    );

    const newVehicles = vehicleForCreate.map((vehicle) =>
      this.vehicleRepository.create({
        vehicleId: vehicle.grz,
        route: routesMap.get(`${vehicle.routeType}-${vehicle.routeNum}`),
      }),
    );

    const savedVehicles = await this.vehicleRepository.save(newVehicles);
    return [...existVehicles, ...savedVehicles];
  }

  private getAllVehicles() {
    return this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoin('vehicle.route', 'route')
      .select([
        'vehicle.vehicleId',
        'vehicle.id',
        'route.id',
        'route.routeNum',
        'route.type',
      ])
      .getMany();
  }
}
