import { Logger, OnModuleInit } from '@nestjs/common';
import * as _ from 'lodash';
import { Route } from '../routes/route.entity';
import { PikasService } from 'pikas/pikas.service';
import { LogPerformance } from 'shared/decorators/log-pefomance';
import { BusStation } from 'bus-stations/bus-station.entity';
import { BusStationsService } from 'bus-stations/bus-stations.service';
import { RouteDirectionService } from 'route-direction/route-direction.service';
import { RouteService } from 'routes/route.service';
import { RouteDirectionSchema } from 'pikas/validation-schemas/route-direction.schema';
import { RouteDirection } from 'route-direction/route-direction.entity';
import { PikasRouteDirectionCoordinates } from 'pikas/types/pikas-route-directions.type';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { registerScheduledJobs } from 'common/utils/register-scheduled-jobs.util';
import { ParsingJobName } from './enums/parsing-job-name.enum';
import { PARSING_ROUTE_QUEUE } from './constants/queue-names';

@Processor(PARSING_ROUTE_QUEUE)
export class RouteParserService extends WorkerHost implements OnModuleInit {
    constructor(
        private busStationService: BusStationsService,
        private pikasService: PikasService,
        private routeDirectionService: RouteDirectionService,
        private routeService: RouteService,
        @InjectQueue(PARSING_ROUTE_QUEUE) private parsingQueue: Queue,
    ) {
        super();
    }

    onModuleInit() {
        registerScheduledJobs(this.parsingQueue, [
            {
                jobName: ParsingJobName.ROUTE,
                options: {
                    every: 1000000,
                },
            },
        ]);
    }

    async process(job: Job, token?: string): Promise<any> {
        await this.parse();
    }

    @LogPerformance({
        start: (context) => Logger.debug('Start parsing routes', context.constructor.name),
        end: (time, context) => Logger.debug(`Finished parsing routes (speed: ${time} c)`, context.constructor.name),
    })
    public async parse() {
        const stations = await this.getStations();
        const pikasRoutes = await this.getRoutesFromPikas();
        const existedRoutes = await this.getExistedRoutes();

        for (const routeNumAndType in pikasRoutes) {
            if (!existedRoutes[routeNumAndType]) {
                existedRoutes[routeNumAndType] = await this.createNewRoute(pikasRoutes[routeNumAndType], stations);
            } else {
                existedRoutes[routeNumAndType] = await this.diffChangesAndUpdate(
                    pikasRoutes[routeNumAndType],
                    existedRoutes[routeNumAndType],
                    stations,
                );
            }
        }

        return Object.values(existedRoutes);
    }

    private async getStations(): Promise<Record<string, BusStation>> {
        const busStations = await this.busStationService.getAll();

        return _.keyBy(busStations, (busStation) => busStation.id);
    }

    private async getRoutesFromPikas() {
        const routes = await this.pikasService.getRoutes();

        return _.groupBy(routes, (route) => `${route.routeNum},${route.type}`);
    }

    private async getExistedRoutes(): Promise<Record<string, Route>> {
        const routes = await this.routeService.getAllWithAllSlaves();

        return _.keyBy(routes, (route) => `${route.num},${route.type}`);
    }

    private async createNewRoute(
        routesFromPikas: RouteDirectionSchema[],
        stationsRecords: Record<string, BusStation>,
    ): Promise<Route> {
        const routeInfo = {
            num: routesFromPikas[0].routeNum,
            type: routesFromPikas[0].type,
        };

        const pikasRouteDirections = await this.pikasService.getRouteDirections(routeInfo.type, routeInfo.num);

        const routeDirections: RouteDirection[] = [];

        for (const routeFromPikas of routesFromPikas) {
            const pikasRouteDirection = pikasRouteDirections.find(({ type }) => type === routeFromPikas.direction);

            if (pikasRouteDirection) {
                const busStations = this.getBusStationsFromRecords(stationsRecords, routeFromPikas.stations);
                const routeDirection = await this.createRouteDirection(
                    routeFromPikas,
                    pikasRouteDirection,
                    busStations,
                );

                routeDirections.push(routeDirection);
            }
        }

        return await this.routeService.create({
            num: routeInfo.num,
            type: routeInfo.type,
            directions: routeDirections,
        });
    }

    private getBusStationsFromRecords(stationsRecords: Record<string, BusStation>, ids: string[]) {
        const result: BusStation[] = [];
        for (const id of ids) {
            if (stationsRecords[id]) {
                result.push(stationsRecords[id]);
            }
        }

        return result;
    }

    private async diffChangesAndUpdate(
        pikasRouteDirections: RouteDirectionSchema[],
        route: Route,
        stationsRecords: Record<string, BusStation>,
    ): Promise<Route> {
        const routeInfo = {
            num: pikasRouteDirections[0].routeNum,
            type: pikasRouteDirections[0].type,
        };

        const pikasRouteDirectionsCoordinates = await this.pikasService.getRouteDirections(
            routeInfo.type,
            routeInfo.num,
        );

        const routeDirections: RouteDirection[] = [];

        for (const pikasRouteDirection of pikasRouteDirections) {
            const pikasRouteDirectionCoordinates = pikasRouteDirectionsCoordinates.find(
                ({ type }) => type === pikasRouteDirection.direction,
            );
            const busStations = this.getBusStationsFromRecords(stationsRecords, pikasRouteDirection.stations);
            const routeDirection = route.directions.find(({ type }) => type === pikasRouteDirection.direction);

            if (!routeDirection && pikasRouteDirectionCoordinates) {
                const newRouteDirection = await this.createRouteDirection(
                    pikasRouteDirection,
                    pikasRouteDirectionCoordinates,
                    busStations,
                );
                routeDirections.push(newRouteDirection);
            }
            if (routeDirection) {
                const newRouteDirection = await this.updateRouteDirection(
                    routeDirection,
                    busStations,
                    pikasRouteDirection,
                );

                routeDirections.push(newRouteDirection);
            }
        }

        if (!_.isEqual(route.directions, routeDirections)) {
            return await this.routeService.update(route, { directions: routeDirections });
        }

        return route;
    }

    private async createRouteDirection(
        pikasRoute: RouteDirectionSchema,
        pikasRouteDirection: PikasRouteDirectionCoordinates,
        stations: BusStation[],
    ) {
        return await this.routeDirectionService.create({
            type: pikasRoute.direction,
            name: pikasRoute.name,
            busStations: stations,
            coordinates: { type: 'LineString', coordinates: pikasRouteDirection.coordinates },
        });
    }

    private async updateRouteDirection(
        routeDirection: RouteDirection,
        newBusStations: BusStation[],
        pikasRouteDirection: RouteDirectionSchema,
    ) {
        const updateData: Partial<RouteDirection> = {};

        const prevBusStationsForCompare = _.sortBy(routeDirection.busStations, ({ id }) => id).map(({ id }) => id);
        const newBusStationsForCompare = _.sortBy(newBusStations, ({ id }) => id).map(({ id }) => id);

        if (!_.isEqual(prevBusStationsForCompare, newBusStationsForCompare)) {
            updateData.busStations = newBusStations;
        }

        if (routeDirection.name !== pikasRouteDirection.name) {
            updateData.name = pikasRouteDirection.name;
        }

        if (Object.keys(updateData).length) {
            return await this.routeDirectionService.update(routeDirection, updateData);
        }

        return routeDirection;
    }
}
