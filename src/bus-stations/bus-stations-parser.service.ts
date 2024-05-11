import { Injectable, Logger } from '@nestjs/common';
import { BusStation } from './bus-station.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogPerfomance } from 'src/shared/decorators/log-pefomance';
import { PikasService } from 'src/pikas/pikas.service';

@Injectable()
export class BusStationsParserService {
  constructor(
    @InjectRepository(BusStation)
    private busStationsRepository: Repository<BusStation>,
    private pikasService: PikasService,
  ) {}

  @LogPerfomance({
    start: (context) =>
      Logger.debug('Start parsing bus stations', context.constructor.name),
    end: (time, context) =>
      Logger.debug(
        `Finished parsing bus stations (speed: ${time} c)`,
        context.constructor.name,
      ),
  })
  public async parse(): Promise<BusStation[]> {
    const busStations: BusStation[] = await this.pikasService.getBusStations();
    const existingBusStations = await this.getAllIds();

    for (const busStation of busStations) {
      if (!existingBusStations.has(busStation.id)) {
        const newBusStation = await this.busStationsRepository.save(busStation);
        existingBusStations.set(newBusStation.id, newBusStation);
      }
    }

    return [...existingBusStations.values()];
  }

  private async getAllIds(): Promise<Map<string, BusStation>> {
    const stations = await this.busStationsRepository.find({
      select: ['id'],
    });

    return new Map<string, BusStation>(
      stations.map((station) => [station.id, station]),
    );
  }

  private parseFloat(str: string): number {
    const floatString = [str.slice(undefined, 2), str.slice(2)].join('.');

    return parseFloat(floatString);
  }
}
