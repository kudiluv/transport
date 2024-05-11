import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BusStation } from './bus-station.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from 'src/routes/route.entity';

@Injectable()
export class BusStationsService {
  constructor(
    @InjectRepository(BusStation)
    private busStationsRepository: Repository<BusStation>,
  ) {}

  public async get() {
    const data = await this.busStationsRepository
      .createQueryBuilder('busStation')
      // .leftJoinAndMapMany(
      //   'busStation.routes',
      //   Route,
      //   'route',
      //   'busStation.id = ANY(route.ABStations) OR busStation.id = ANY(route.BAStations)',
      // )
      .getMany();
    return data;
  }
}
