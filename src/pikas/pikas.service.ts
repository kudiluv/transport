import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RouteTypeMapper } from './mappers/route-type.mapper';
import { transliterate as tr } from 'transliteration';
import { ParsedVehiclePositionSchema } from './validation-schemas/parsed-vehicle-position.schema';
import { ParsedVehiclePositionDto } from './dto/parsed-vehicle-position.dto';
import { csvDecompressor } from 'src/shared/helpers/csv-decompressor';
import { BusStation } from 'src/bus-stations/bus-station.entity';
import { ParsedRoute } from 'src/routes/dto/parsed-route';
import { RouteType } from 'src/routes/enums/RouteType';
import { RouteDirection } from './enum/RouteDirection';
import * as _ from 'lodash';
import { LineString } from 'typeorm';
import * as polyline from 'google-polyline';

@Injectable()
export class PikasService {
  private axios = axios.create({
    baseURL: 'https://its-rnd.ru/pikasonline',
  });

  public async getVehiclePositions(): Promise<ParsedVehiclePositionDto[]> {
    const { data } = await this.axios.get<string>('/p04ktwt0.txt');
    return data
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
      .map((value) => ParsedVehiclePositionSchema.safeParse(value))
      .map((data) => (data.success ? data.data : null))
      .filter((value) => !!value);
  }

  public async getBusStations() {
    const { data: rowData } = await this.axios.get<string>('/rostov/stops.txt');
    return csvDecompressor(rowData).map(
      (row): BusStation => ({
        id: row[0],
        position: {
          type: 'Point',
          coordinates: [
            this.parseCoordinate(row[2]),
            this.parseCoordinate(row[1]),
          ],
        },
        name: row[4] ?? '',
      }),
    );
  }

  public async getRoutes(): Promise<ParsedRoute[]> {
    const result = await this.axios.get<string>(`/rostov/routes.txt`);

    const rows = result.data.split('\n');
    const clearedData = [
      rows[0],
      ...rows.slice(3).filter((value, index) => index % 2 === 0),
    ].join('\n');

    const decompressedData = csvDecompressor(clearedData);

    const parsedRoutes = decompressedData.map((row) => ({
      routeNum: tr(row[0]),
      type: row[3] as RouteType,
      direction: row[8] as RouteDirection,
      name: row[10] as string,
      stations: row[13].split(',') as string[],
    }));

    const rotesIdentifiers = parsedRoutes.map((route) => ({
      routeNum: route.routeNum,
      type: route.type,
    }));

    const uniqRoutesIdentifires = _.uniqWith(rotesIdentifiers, _.isEqual);

    return uniqRoutesIdentifires.map((route) => {
      const abInfo = parsedRoutes.find((r) => {
        return (
          r.routeNum === route.routeNum &&
          r.direction === RouteDirection.AB &&
          r.type === route.type
        );
      });

      const baInfo = parsedRoutes.find((r) => {
        return (
          r.routeNum === route.routeNum &&
          r.direction === RouteDirection.BA &&
          r.type === route.type
        );
      });

      return {
        routeNum: route.routeNum,
        type: route.type,
        abName: abInfo?.name ?? '',
        baName: baInfo?.name ?? '',
        ABStations: abInfo?.stations ?? [],
        BAStations: baInfo?.stations ?? [],
      };
    });
  }

  public async getRoutePaths(
    type: RouteType,
    name: string,
  ): Promise<{
    AB: LineString;
    BA: LineString;
  }> {
    const result = await this.axios.get<string>(
      `/rostov/rostov_${type}_${name}.txt`,
    );

    const values = result.data.split('\r\n');

    const AB = values[1] ? polyline.decode(values[1]) : [];
    const BA = values[4] ? polyline.decode(values[4]) : [];
    const ABLngLat = AB.map(([lat, lng]) => [lng, lat]);
    const BALngLat = BA.map(([lat, lng]) => [lng, lat]);

    return {
      AB: {
        coordinates: ABLngLat,
        type: 'LineString',
      },
      BA: {
        coordinates: BALngLat,
        type: 'LineString',
      },
    };
  }

  private parseCoordinate(str: string) {
    const floatString = [str.slice(undefined, 2), str.slice(2)].join('.');

    return parseFloat(floatString);
  }
}
