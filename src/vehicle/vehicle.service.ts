import { Injectable } from '@nestjs/common';
import { VehicleCreateParams } from './types/vehicle-create-params.type';
import { Transactional, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { Vehicle } from './vehicle.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VehicleService {
    constructor(
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @InjectRepository(Vehicle) private readonly vehicleRepository: Repository<Vehicle>,
    ) {}

    private get txRepository() {
        return this.txHost.tx.getRepository(Vehicle);
    }

    public getAll() {
        return this.vehicleRepository.find();
    }

    @Transactional()
    public async findOrCreate(dto: VehicleCreateParams): Promise<Vehicle> {
        const vehicle = await this.txRepository.findOne({
            where: {
                regNumber: dto.regNumber,
            },
        });

        if (vehicle) {
            return vehicle;
        }

        const newVehicle = this.txRepository.create({
            regNumber: dto.regNumber,
        });

        return this.txRepository.save(newVehicle);
    }

    @Transactional()
    public async create(dto: VehicleCreateParams): Promise<Vehicle> {
        const newVehicle = this.txRepository.create({
            regNumber: dto.regNumber,
        });

        return this.txRepository.save(newVehicle);
    }
}
