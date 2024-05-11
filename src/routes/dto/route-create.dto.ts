import { LineString } from 'typeorm';
import { RouteType } from '../enums/RouteType';

export class RouteCreateDto {
  routeNum: string;
  type: RouteType;
  AB: LineString;
  BA: LineString;
  ABName: string;
  BAName: string;
  ABStations: string[];
  BAStations: string[];
}
