import { Controller, Get, Logger, Query } from '@nestjs/common';
import { VehiclePositionService } from './vehicle-position.service';
import { VehicleSearchDto } from './dto/vehicle-search.dto';
import { LogPerformance } from 'shared/decorators/log-pefomance';
import { Proto } from 'shared/decorators/proto';

@Controller('vehicle-position')
export class VehiclePositionController {
    constructor(private vehiclePositionService: VehiclePositionService) {}

    @Get()
    @LogPerformance({
        start: (context) => Logger.log('start get info about positions', context.constructor.name),
        end: (time, context) => Logger.log(`end get info about positions (speed: ${time} c)`, context.constructor.name),
    })
    @Proto({
        path: __dirname + '/vehicle-positions.proto',
        schema: (proto) => proto.VehiclePositionResponse,
    })
    public async getVehiclePositions(@Query() searchDto: VehicleSearchDto) {
        return {
            vehiclePositions: await this.vehiclePositionService.getAllByPosition(searchDto),
        };
    }
}
