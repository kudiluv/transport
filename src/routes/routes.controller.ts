import { Controller, Get, Header, Param, ParseIntPipe } from '@nestjs/common';
import { RouteService } from './route.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RouteItemOfListDto } from './dto/route-item-of-list-output.dto';

@Controller('routes')
export class RoutesController {
    constructor(private routesService: RouteService) {}

    @Header('content-type', 'text/html')
    @Get(':id')
    get(@Param('id', ParseIntPipe) params: number) {
        // return this.routesService.getRoutePath(params);
    }

    @Get(':id/detail')
    getDetail(@Param('id', ParseIntPipe) params: number) {
        // return this.routesService.getRouteDetail(params);
    }

    @Get()
    @ApiOperation({ summary: 'Get all routes' })
    @ApiResponse({ type: [RouteItemOfListDto] })
    async getAll() {
        const routes = await this.routesService.getAllWithSlaves();

        return RouteItemOfListDto.getListFromEntities(routes);
    }
}
