import { RouteType } from '../enums/RouteType';

export type ParsedRoute = {
  routeNum: string;
  type: RouteType;
  abName: string;
  baName: string;
  ABStations: string[];
  BAStations: string[];
};
