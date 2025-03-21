import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RouteTypeMapper } from './mappers/route-type.mapper';
import { transliterate as tr } from 'transliteration';
import { ParsedVehiclePositionSchema } from './validation-schemas/parsed-vehicle-position.schema';
import { ParsedVehiclePositionDto } from './dto/parsed-vehicle-position.dto';
import * as _ from 'lodash';
import * as polyline from 'google-polyline';
import { decompressCSV } from 'shared/helpers/csv-decompressor';
import { busStationSchema, BusStationSchema } from './validation-schemas/bus-station.schema';
import { RouteDirectionSchema, routeDirectionSchema } from './validation-schemas/route-direction.schema';
import { RouteType } from './enum/route-type.enum';
import { PikasRouteDirectionCoordinates } from './types/pikas-route-directions.type';

@Injectable()
export class PikasService {
    private axios = axios.create({
        baseURL: 'https://its-rnd.ru/pikasonline',
    });

    public async getVehiclePositions(): Promise<ParsedVehiclePositionDto[]> {
        const { data } = await this.axios.get<string>('/p04ktwt0.txt');

        return data
            .trim()
            .split(',\r\n')
            .map((value) => value.split(','))
            .map((values) => ({
                routeType: RouteTypeMapper[values[0]],
                routeNum: tr(values[1]),
                position: values.slice(2, 4).map(this.parseCoordinate),
                speed: Number(values[4]),
                rotation: values[5],
                grz: values[6],
            }))
            .map((value) => ParsedVehiclePositionSchema.parse(value));
    }

    public async getBusStations(): Promise<BusStationSchema[]> {
        const { data: rowData } = await this.axios.get<string>('/rostov/stops.txt');
        const result = decompressCSV(rowData);

        return result.map(
            (row): BusStationSchema =>
                busStationSchema.parse({
                    id: row[0],
                    lat: this.parseCoordinate(row[1]),
                    long: this.parseCoordinate(row[2]),
                    name: row[4] ?? '',
                }),
        );
    }

    public async getRoutes(): Promise<RouteDirectionSchema[]> {
        const result = await this.axios.get<string>(`/rostov/routes.txt`);

        const rows = result.data.split('\n');
        const headers = rows[0];
        // данные начинаеются с 4 строки, каждая нечётная строка явлется данными
        const data = rows.slice(3).filter((_, index) => index % 2 === 0);
        const compressedData = [headers, ...data].join('\n');

        const decompressedData = decompressCSV(compressedData);

        return (
            decompressedData
                .map((row) =>
                    routeDirectionSchema.parse({
                        routeNum: tr(row[0]),
                        type: row[3],
                        direction: row[8],
                        name: row[10],
                        stations: row[13].split(','),
                    }),
                )
                // remove station duplicates
                .map((row) => ({ ...row, stations: _.uniq(row.stations) }))
        );
    }

    public async getRouteDirections(type: RouteType, name: string): Promise<PikasRouteDirectionCoordinates[]> {
        const result = await this.axios.get<string>(`/rostov/rostov_${type}_${name}.txt`);

        const rows = result.data.trim().split('\r\n');

        const routeDirections: PikasRouteDirectionCoordinates[] = [];

        for (let index = 0; index < rows.length; index += 3) {
            const type = rows[index];
            const coordinates = polyline.decode(rows[index + 1]);

            routeDirections.push({
                type,
                coordinates,
            });
        }

        return routeDirections;
    }

    private parseCoordinate(str: string) {
        const floatString = [str.slice(undefined, 2), str.slice(2)].join('.');

        return parseFloat(floatString);
    }
}
