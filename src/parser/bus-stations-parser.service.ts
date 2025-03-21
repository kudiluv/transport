import { Logger, OnModuleInit } from '@nestjs/common';
import { LogPerformance } from 'shared/decorators/log-pefomance';
import { BusStation } from '../bus-stations/bus-station.entity';
import { PikasService } from 'pikas/pikas.service';
import { BusStationsService } from 'bus-stations/bus-stations.service';
import * as _ from 'lodash';
import { BusStationSchema } from 'pikas/validation-schemas/bus-station.schema';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { PARSING_BUS_STATIONS_QUEUE } from './constants/queue-names';
import { Job, Queue } from 'bullmq';
import { registerScheduledJobs } from 'common/utils/register-scheduled-jobs.util';
import { ParsingJobName } from './enums/parsing-job-name.enum';

@Processor(PARSING_BUS_STATIONS_QUEUE)
export class BusStationsParserService extends WorkerHost implements OnModuleInit {
    constructor(
        private pikasService: PikasService,
        private busStationsService: BusStationsService,
        @InjectQueue(PARSING_BUS_STATIONS_QUEUE) private parsingQueue: Queue,
    ) {
        super();
    }
    async process(job: Job, token?: string): Promise<any> {
        await this.parse();
    }
    onModuleInit() {
        registerScheduledJobs(this.parsingQueue, [
            {
                jobName: ParsingJobName.BUS_STATIONS,
                options: {
                    every: 1000000,
                },
            },
        ]);
    }

    @LogPerformance({
        start: (context) => Logger.debug('Start parsing bus stations', context.constructor.name),
        end: (time, context) =>
            Logger.debug(`Finished parsing bus stations (speed: ${time} c)`, context.constructor.name),
    })
    public async parse(): Promise<BusStation[]> {
        const busStations = await this.pikasService.getBusStations();
        const existingBusStations = await this.getExistingBusStations();

        for (const busStation of busStations) {
            const existingBusStation: BusStation | undefined = existingBusStations[busStation.id];
            if (!this.compareBusStations(busStation, existingBusStation)) {
                const newBusStation = await this.busStationsService.upsert({
                    id: busStation.id,
                    name: busStation.name,
                    coordinates: {
                        type: 'Point',
                        coordinates: [busStation.long, busStation.lat],
                    },
                });
                existingBusStations[busStation.id] = newBusStation;
            }
        }

        return Object.values(existingBusStations);
    }

    private compareBusStations(busStationSchema: BusStationSchema, busStation?: BusStation) {
        return (
            busStationSchema.id === busStation?.id &&
            busStationSchema.name === busStation?.name &&
            _.isEqual([busStationSchema.long, busStationSchema.lat], busStation?.coordinates?.coordinates)
        );
    }

    private async getExistingBusStations(): Promise<Record<string, BusStation>> {
        const stations = await this.busStationsService.getAll();

        return _.keyBy(stations, (station) => station.id);
    }
}
