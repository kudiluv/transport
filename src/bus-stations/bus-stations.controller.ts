import { Controller, Get, Logger, Param, StreamableFile } from '@nestjs/common';
import { BusStationsService } from './bus-stations.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { BusStationOutputDto } from './dto/bus-station-output.dto';
import { LogPerformance } from 'shared/decorators/log-pefomance';
import { Proto } from 'shared/decorators/proto';
import { unpack, pack } from 'msgpackr';
import { decode, diagnose, encode } from 'cbor2';

@Controller('bus-stations')
export class BusStationsController {
    constructor(private busStationService: BusStationsService) {}

    @Get()
    @ApiOkResponse({ type: [BusStationOutputDto] })
    @LogPerformance({
        start: (context) => Logger.debug('Start getting bus stations', context.constructor.name),
        end: (time, context) =>
            Logger.debug(`Finished getting bus stations (speed: ${time} c)`, context.constructor.name),
    })
    async getBusses() {
        const busStations = await this.busStationService.getAll();

        return BusStationOutputDto.fromListEntity(busStations);
    }

    @Get('/proto')
    @ApiOkResponse({ type: [BusStationOutputDto] })
    @LogPerformance({
        start: (context) => Logger.debug('Start getting bus stations', context.constructor.name),
        end: (time, context) =>
            Logger.debug(`Finished getting bus stations (speed: ${time} c)`, context.constructor.name),
    })
    @Proto({
        path: __dirname + '/proto/bus-stations.proto',
        schema: (proto) => proto.writeBusStationsResponse,
    })
    async getBussesByProto() {
        const busStations = await this.busStationService.getAll();

        return {
            busStations: BusStationOutputDto.fromListEntity(busStations),
        };
    }

    @Get('/message-pack')
    @ApiOkResponse({ type: [BusStationOutputDto] })
    @LogPerformance({
        start: (context) => Logger.debug('Start getting bus stations', context.constructor.name),
        end: (time, context) =>
            Logger.debug(`Finished getting bus stations (speed: ${time} c)`, context.constructor.name),
    })
    async getBussesByMessagePack() {
        const busStations = await this.busStationService.getAll();

        return new StreamableFile(pack(BusStationOutputDto.fromListEntity(busStations)));
    }

    @Get('/cbor')
    @ApiOkResponse({ type: [BusStationOutputDto] })
    @LogPerformance({
        start: (context) => Logger.debug('Start getting bus stations', context.constructor.name),
        end: (time, context) =>
            Logger.debug(`Finished getting bus stations (speed: ${time} c)`, context.constructor.name),
    })
    async getBussesByCbor() {
        const busStations = await this.busStationService.getAll();
        const data = encode(BusStationOutputDto.fromListEntity(busStations));
        console.log(decode(data));

        return new StreamableFile(data);
    }

    // @Get(':id')
    // getBus(@Param('id') id: string) {
    //     return this.busStationService.getById(id);
    // }
}
