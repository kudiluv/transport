import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusStationDetails } from './dto/bus-station-details';
import { BusStation } from './bus-station.entity';
import { BusStationCreateParams } from './types/bus-station-create-params.type';
import { LogPerformance } from 'shared/decorators/log-pefomance';

@Injectable()
export class BusStationsService {
    constructor(
        @InjectRepository(BusStation)
        private busStationsRepository: Repository<BusStation>,
    ) {}

    public async getAll() {
        const data = await this.busStationsRepository.createQueryBuilder('busStation').getMany();
        return data;
    }

    public upsert(params: BusStationCreateParams) {
        return this.busStationsRepository.save({
            id: params.id,
            name: params.name,
            coordinates: params.coordinates,
        });
    }
}
