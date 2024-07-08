import { Injectable, Logger } from '@nestjs/common';
import { RouteParserService } from '../routes/route-parser.service';
import { firstValueFrom, shareReplay, switchMap, timer } from 'rxjs';
import { BusStationsParserService } from 'src/bus-stations/bus-stations-parser.service';
import { LogPerfomance } from 'src/shared/decorators/log-pefomance';
import { VehicleParserService } from 'src/vehicle/vehicle-parser.service';
import { VehiclePositionParserService } from 'src/vehicle-position/verhicle-position-parser.service';
import { PikasService } from 'src/pikas/pikas.service';

/**
 * 1. Парсинг остановок:
 * 1.1 Получить информацию о существующих остановках
 * 1.2 Добавить или обновить остановки
 * 1.3 Вернуть все остановки из базы данных
 * 2. Парсинг маршрутов:
 * 2.1 Получить информацию о существующих маршрутах
 * 2.2 Добавить или обновить маршруты
 * 2.3 Добавить или обновить иноврмацию о остановках маршрута
 * 3. Парсинг местополжения транспорта
 * 3.1 Получить список всего существующего транспорта
 * 3.2 Добавить отсутсвующий транспорт
 * 3.3 Сохранить местоположение транспорта
 */
@Injectable()
export class ParserService {
  constructor(
    private routeParser: RouteParserService,
    private busStationsParserService: BusStationsParserService,
    private vehicleParserService: VehicleParserService,
    private pikasService: PikasService,
    private vehiclePositionParserService: VehiclePositionParserService,
  ) {
    setInterval(async () => {
      try {
        await this.parse();
      } catch (error) {
        console.log(error);
      }
    }, 40000);
  }

  @LogPerfomance({
    start: (context) =>
      Logger.debug('Start parsing vehicle positions', context.constructor.name),
    end: (time, context) =>
      Logger.debug(
        `Finished parsing vehicle positions (speed: ${time} c)`,
        context.constructor.name,
      ),
  })
  async parse() {
    const data = await this.pikasService.getVehiclePositions();

    const existingRoutes = await firstValueFrom(this.routes$);
    const vehicles = await this.vehicleParserService.parse(
      data,
      existingRoutes,
    );
    await this.vehiclePositionParserService.parse(
      data,
      vehicles,
      existingRoutes,
    );
  }

  busStations$ = timer(0, 60000).pipe(
    switchMap(() => this.busStationsParserService.parse()),
  );

  routes$ = this.busStations$.pipe(
    switchMap((busStations) => this.routeParser.parse(busStations)),
    shareReplay(1),
  );
}
