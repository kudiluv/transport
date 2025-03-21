import { BusStation } from 'bus-stations/bus-station.entity';
import { LineString } from 'typeorm';

export type CreateRouteDirectionParams = {
    busStations: BusStation[];
    coordinates: LineString;
    name: string;
    type: string;
};
