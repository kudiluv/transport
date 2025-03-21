import { Logger, OnModuleInit } from '@nestjs/common';
import { Point } from 'typeorm';
import * as _ from 'lodash';
import { VehiclePositionService } from '../vehicle-position/vehicle-position.service';
import { HistoryTimestampService } from 'history-timestamp/history-timestamp.service';
import * as turf from '@turf/turf';
import { RouteService } from 'routes/route.service';
import { PikasService } from 'pikas/pikas.service';
import { RouteSlave } from 'routes/enums/route-slave.enum';
import { VehicleService } from 'vehicle/vehicle.service';
import { VehiclePositionCreateDto } from 'vehicle-position/dto/vehicle-position-create.dto';
import { RouteDirection } from 'route-direction/route-direction.entity';
import { LogPerformance } from 'shared/decorators/log-pefomance';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { PARSING_VEHICLE_POSITIONS_QUEUE } from './constants/queue-names';
import { Job, Queue } from 'bullmq';
import { registerScheduledJobs } from 'common/utils/register-scheduled-jobs.util';
import { ParsingJobName } from './enums/parsing-job-name.enum';

@Processor(PARSING_VEHICLE_POSITIONS_QUEUE)
export class VehiclePositionParserService extends WorkerHost implements OnModuleInit {
    constructor(
        private routeService: RouteService,
        private pikasService: PikasService,
        private vehiclePositionService: VehiclePositionService,
        private vehicleService: VehicleService,
        private historyTimestampService: HistoryTimestampService,
        @InjectQueue(PARSING_VEHICLE_POSITIONS_QUEUE) private parsingQueue: Queue,
    ) {
        super();
    }
    async process(job: Job, token?: string): Promise<any> {
        await this.parse();
    }
    onModuleInit() {
        registerScheduledJobs(this.parsingQueue, [
            {
                jobName: ParsingJobName.VEHICLE_POSITIONS,
                options: {
                    every: 1000,
                },
            },
        ]);
    }

    @LogPerformance({
        start: (context) => Logger.debug('Start parsing vehicle positions', context.constructor.name),
        end: (time, context) =>
            Logger.debug(`Finished parsing vehicle positions (speed: ${time} c)`, context.constructor.name),
    })
    public async parse() {
        const [routes, parsedPositions, prevVehiclePositions, vehicles, historyTimestamp] = await Promise.all([
            this.getRoutes(),
            this.pikasService.getVehiclePositions(),
            this.getPrevPositionsByRegNumber(),
            this.getVehicles(),
            this.historyTimestampService.create(),
        ]);

        const vehiclePositionsCreateParams: VehiclePositionCreateDto[] = [];

        for (const parsedPosition of parsedPositions) {
            const route = routes[`${parsedPosition.routeNum},${parsedPosition.routeType}`];
            if (!route) {
                continue;
            }

            const vehicle = vehicles[parsedPosition.grz]
                ? vehicles[parsedPosition.grz]
                : await this.vehicleService.create({ regNumber: parsedPosition.grz });
            const prevPosition = prevVehiclePositions[vehicle.regNumber]?.coordinates;

            vehiclePositionsCreateParams.push({
                rotation: parsedPosition.rotation,
                speed: parsedPosition.speed,
                position: turf.point(parsedPosition.position).geometry,
                historyTimestamp,
                vehicle,
                routeDirection:
                    this.getRouteDirection(
                        route.directions,
                        turf.point(parsedPosition.position).geometry,
                        prevPosition,
                    ) ?? null,
                prevPosition: null,
            });
        }

        await this.vehiclePositionService.butchCreate(vehiclePositionsCreateParams);
    }

    private getRouteDirection(routeDirections: RouteDirection[], position: Point, prevPosition = position) {
        return _.maxBy(routeDirections, (routeDirection) => {
            const prevPosIndex = _.indexOf(
                routeDirection.coordinates.coordinates,
                _.minBy(routeDirection.coordinates.coordinates, (routePoint) =>
                    turf.distance(turf.point(routePoint), prevPosition),
                ),
            );
            const currentPosIndex = _.indexOf(
                routeDirection.coordinates.coordinates,
                _.minBy(routeDirection.coordinates.coordinates, (routePoint) =>
                    turf.distance(turf.point(routePoint), position),
                ),
            );
            const order = currentPosIndex - prevPosIndex;
            return order;
        });
    }

    private async getRoutes() {
        const routes = await this.routeService.getAllWithSlaves([RouteSlave.DIRECTIONS]);

        return _.keyBy(routes, (route) => `${route.num},${route.type}`);
    }

    private async getVehicles() {
        const vehicles = await this.vehicleService.getAll();

        return _.keyBy(vehicles, (vehicle) => vehicle.regNumber);
    }

    private async getPrevPositionsByRegNumber() {
        const positions = await this.vehiclePositionService.getAll();

        return _.keyBy(positions, (position) => position.vehicle.regNumber);
    }
}
