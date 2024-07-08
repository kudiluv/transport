import { Vehicle } from 'src/vehicle/vehicle.entity';
import {
  Column,
  Entity,
  JoinTable,
  LineString,
  ManyToMany,
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

  @ManyToMany(() => BusStation, (station) => station.routesAB)
  @JoinTable()
  ABStations: BusStation[];

  @ManyToMany(() => BusStation, (station) => station.routesBA)
  @JoinTable()
  BAStations: BusStation[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.route)
  vehicles: Vehicle[];
}
