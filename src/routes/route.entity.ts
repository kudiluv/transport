import { Vehicle } from 'src/vehicle/vehicle.entity';
import {
  Column,
  Entity,
  LineString,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RouteType } from './enums/RouteType';
import { BusStation } from 'src/bus-stations/bus-station.entity';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RouteType,
  })
  type: RouteType;

  @Column()
  routeNum: string;

  @Column('geometry', { nullable: true, select: false })
  AB: LineString;

  @Column('geometry', { nullable: true, select: false })
  BA: LineString;

  @Column()
  ABName: string;

  @Column()
  BAName: string;

  @Column('varchar', { array: true, select: false })
  ABStations: string[];

  ABStationsEntities?: BusStation[];

  @Column('varchar', { array: true, select: false })
  BAStations: string[];

  BAStationsEntities: BusStation[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.route)
  vehicles: Vehicle[];
}
