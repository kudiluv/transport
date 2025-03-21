import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleSearchDto } from './dto/vehicle-search.dto';
import * as _ from 'lodash';
import { VehiclePosition } from './vehicle-position.entity';
import { HistoryTimestampService } from 'history-timestamp/history-timestamp.service';
import { VehiclePositionQuery } from './queries/vehicle-position.query';
import { VehiclePositionCreateDto } from './dto/vehicle-position-create.dto';
import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

@Injectable()
export class VehiclePositionService {
    constructor(
        @InjectRepository(VehiclePosition)
        private vehiclePositionRepository: Repository<VehiclePosition>,
        private historyTimestampService: HistoryTimestampService,
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
    ) {}

    private get txRepository() {
        return this.txHost.tx.getRepository(VehiclePosition);
    }

    public async getAll() {
        const historyTimestamp = await this.historyTimestampService.getOrCreateLast();

        return new VehiclePositionQuery(this.vehiclePositionRepository)
            .addWhereByHistoryTimestampId(historyTimestamp.id)
            .execMany();
    }

    public async getAllByPosition(searchDto: VehicleSearchDto) {
        const historyTimestamp = await this.historyTimestampService.getOrCreateLast();

        const query = new VehiclePositionQuery(this.vehiclePositionRepository).addWhereByHistoryTimestampId(
            historyTimestamp.id,
        );

        if (searchDto.buses.length) {
            query.addWhereByRouteIds(searchDto.buses);
        }

        if (searchDto.position) {
            query.addSortByDistance(searchDto.position);
        }

        const positions = await query.addLimit(80).execMany();
        return this.sortByVehicleId(positions);
    }

    @Transactional()
    public async create(params: VehiclePositionCreateDto) {
        const vehiclePosition = this.txRepository.create({
            historyTimestamp: params.historyTimestamp,
            coordinates: params.position,
            rotation: params.rotation,
            speed: params.speed,
            routeDirection: params.routeDirection,
            vehicle: params.vehicle,
        });

        return this.txRepository.save(vehiclePosition);
    }

    @Transactional()
    public async butchCreate(params: VehiclePositionCreateDto[]) {
        const vehiclePositions = params.map((param) => {
            return this.txRepository.create({
                historyTimestamp: param.historyTimestamp,
                coordinates: param.position,
                rotation: param.rotation,
                speed: param.speed,
                routeDirection: param.routeDirection,
                vehicle: param.vehicle,
            });
        });

        return this.txRepository.save(vehiclePositions);
    }

    private sortByVehicleId(vehiclePos: VehiclePosition[]) {
        return vehiclePos.sort((a, b) => a.vehicle.id - b.vehicle.id);
    }
}
