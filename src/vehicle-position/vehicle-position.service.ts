import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehiclePosition } from './vehicle-position.entity';
import { Repository } from 'typeorm';
import { HistoryTimestampService } from 'src/history-timestamp/history-timestamp.service';
import { VehicleSearchDto } from './dto/vehicle-search.dto';
import * as _ from 'lodash';

@Injectable()
export class VehiclePositionService {
  constructor(
    @InjectRepository(VehiclePosition)
    private vehiclePositionRepository: Repository<VehiclePosition>,
    private historyTimestampService: HistoryTimestampService,
  ) {}

  public async getAll() {
    const historyTimestamp = await this.historyTimestampService.getLast();
    return this.vehiclePositionRepository
      .createQueryBuilder('pos')
      .leftJoinAndSelect('pos.vehicle', 'vehicle')
      .leftJoin('vehicle.route', 'route')
      .addSelect('route.id')
      .addSelect('route.routeNum')
      .addSelect('route.type')
      .where('pos.historyTimestamp.id = :historyId', {
        historyId: historyTimestamp.id,
      })
      .getMany();
  }

  public async getAllByPosition(searchDto: VehicleSearchDto) {
    const historyTimestamp = await this.historyTimestampService.getLast();

    const positionsQuery = await this.vehiclePositionRepository
      .createQueryBuilder('pos')
      .leftJoinAndSelect('pos.vehicle', 'vehicle')
      .leftJoinAndSelect('vehicle.route', 'route')
      .where('pos.historyTimestamp.id = :historyId', {
        historyId: historyTimestamp.id,
      });

    if (searchDto.buses.length) {
      positionsQuery.andWhere('route.id IN (:...buses)', {
        buses: searchDto.buses,
      });
    }

    if (searchDto.position) {
      positionsQuery
        .addSelect(
          `ST_Distance(pos.position, ST_GeomFromGeoJSON(:position))`,
          'distance',
        )
        .setParameter('position', searchDto.position)
        .orderBy('distance');
    }

    const positions = await positionsQuery.limit(80).getMany();
    return this.sortByVehicleId(positions);
  }

  private sortByVehicleId(vehiclePos: VehiclePosition[]) {
    return vehiclePos.sort((a, b) => a.vehicle.id - b.vehicle.id);
  }
}
