import { RouteType } from 'routes/enums/route-type.enum';

export const RouteTypeMapper: Record<string, RouteType> = {
    '1': RouteType.TROL,
    '2': RouteType.BUS,
    '3': RouteType.TRAM,
    '6': RouteType.SUBURBANBUS,
};
