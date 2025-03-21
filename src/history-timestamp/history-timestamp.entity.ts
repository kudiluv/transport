import { CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VehiclePosition } from '../vehicle-position/vehicle-position.entity';

@Entity()
export class HistoryTimestamp {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @CreateDateColumn()
    date: Date;

    @OneToMany(() => VehiclePosition, (position) => position.historyTimestamp)
    vehiclePositions: VehiclePosition[];
}
