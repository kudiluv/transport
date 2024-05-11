import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RouteSpeedInfoView } from './route-speed-info.view';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RouteSpeedInfoService {
  constructor(
    @InjectRepository(RouteSpeedInfoView)
    private routeSpeedInfoRep: Repository<RouteSpeedInfoView>,
    private dataSource: DataSource,
  ) {
    // dataSource
    //   .query('REFRESH MATERIALIZED VIEW route_speed_info_view')
    //   .then(console.log);
    this.routeSpeedInfoRep
      .createQueryBuilder('routeSpeedInfo')
      .select('ST_AsGeoJSON(routeSpeedInfo.closest)::json', 'closest')
      .addSelect('id')
      .getRawMany()
  }
}
