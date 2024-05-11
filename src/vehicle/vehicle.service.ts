import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'src/shared/decorators/transactional';
import { EntityManager, Repository } from 'typeorm';
import { VehicleFindCreateDto } from './dto/vehicle-find-create.dto';
import { Vehicle } from './vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  @Transactional()
  public async findOrCreate(
    dto: VehicleFindCreateDto,
    manager?: EntityManager,
  ): Promise<Vehicle> {
    const vehicle = await manager.findOne(Vehicle, {
      where: {
        route: dto.route,
        vehicleId: dto.vehicleId,
      },
      relations: ['route'],
    });

    if (vehicle) {
      return vehicle;
    }
    const newVehicle = this.vehicleRepository.create({
      route: dto.route,
      vehicleId: dto.vehicleId,
    });
    return manager.save(newVehicle);
  }
}
