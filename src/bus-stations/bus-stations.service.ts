import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BusStation } from './bus-station.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from 'src/routes/route.entity';
import { BusStationDetails } from './dto/bus-station-details';

@Injectable()
export class BusStationsService {
  constructor(
    @InjectRepository(BusStation)
    private busStationsRepository: Repository<BusStation>,
  ) {}

  public async get() {
    const data = await this.busStationsRepository
      .createQueryBuilder('busStation')
      .getMany();
    return data;
  }

  public async getById(id: string): Promise<BusStationDetails> {
    const busStation = await this.busStationsRepository
      .createQueryBuilder('busStation')
      .leftJoinAndSelect('busStation.routesAB', 'routesAB')
      .leftJoinAndSelect('busStation.routesBA', 'routesBA')
      .where('busStation.id = :id', { id })
      .getOne();

    if (!busStation) {
      throw new NotFoundException('Bus station not found');
    }

    return {
      id: busStation.id,
      name: busStation.name,
      position: busStation.position,
      routes: [...busStation.routesAB, ...busStation.routesBA],
    };
  }
}
