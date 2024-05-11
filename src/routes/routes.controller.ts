import { Controller, Get, Header, Param, ParseIntPipe } from '@nestjs/common';
import { RoutesService } from './routes.service';

@Controller('routes')
export class RoutesController {
  constructor(private routesService: RoutesService) {}

  @Header('content-type', 'text/html')
  @Get(':id')
  get(@Param('id', ParseIntPipe) params: number) {
    return this.routesService.getRoutePath(params);
  }

  @Get(':id/detail')
  getDetail(@Param('id', ParseIntPipe) params: number) {
    return this.routesService.getRouteDetail(params);
  }
  @Get()
  routes() {
    return this.routesService.getRoutesGroupedByType();
  }
}
