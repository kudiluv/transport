import { VehiclePosition } from 'src/vehicle-position/vehicle-position.entity';
import { DataSource, Index, Point, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  materialized: true,
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('route.id', 'id')
      .addSelect(
        'ST_ClosestPoint(ST_POINTS(route.fullRoute), vehicle_position.position)',
        'closest',
      )
      .addSelect('AVG(vehicle_position.speed)', 'avgSpeed')
      .addSelect('COUNT(vehicle_position."position")', 'count')
      .from(
        '(select ST_LineMerge(ST_COLLECT(route."AB", route."BA")) as fullRoute, id from route)',
        'route',
      )
      .addFrom(VehiclePosition, 'vehicle_position')
      .where(
        `vehicle_position.historyTimestampId > (select id from history_timestamp where history_timestamp.date >= NOW() - INTERVAL '10 min' limit 1)`,
      )
      .andWhere('vehicle_position.prevPositionId is not null')
      .andWhere(
        'ST_Distance(ST_POINTS(route.fullRoute), vehicle_position.position) < 0.001',
      )
      .andWhere(
        `ST_LineLocatePoint(route.fullRoute, vehicle_position.position) >
         ST_LineLocatePoint(route.fullRoute, (select position from vehicle_position vp2 where vp2.id = vehicle_position.prevPositionId))`,
      )
      .andWhere(
        `ST_Distance(vehicle_position.position, (select position from vehicle_position prev where prev.id = vehicle_position.prevPositionId)) < 0.001`,
      )
      .groupBy('route.id')
      .addGroupBy('closest'),
})
export class RouteSpeedInfoView {
  @Index()
  @ViewColumn()
  id: number;

  @ViewColumn()
  closest: Point;

  @ViewColumn()
  avgSpeed: number;

  @ViewColumn()
  count: number;
}
