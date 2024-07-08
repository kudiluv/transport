import { Controller, Get, Param } from '@nestjs/common';
import { BusStationsService } from './bus-stations.service';

@Controller('bus-stations')
export class BusStationsController {
  constructor(private busStationService: BusStationsService) {}

  @Get()
  getBusses() {
    return this.busStationService.get();
  }

  @Get(':id')
  getBus(@Param('id') id: string) {
    return this.busStationService.getById(id);
  }
}
