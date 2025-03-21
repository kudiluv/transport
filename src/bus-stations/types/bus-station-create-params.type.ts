import { Point } from 'typeorm';

export type BusStationCreateParams = {
    id: string;
    name: string;
    coordinates: Point;
};
