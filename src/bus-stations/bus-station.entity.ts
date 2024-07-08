import { Route } from 'src/routes/route.entity';
import { Column, Entity, ManyToMany, Point, PrimaryColumn } from 'typeorm';

@Entity()
export class BusStation {
  @PrimaryColumn()
  id: string;

  @Column('geometry')
  position: Point;

  @Column()
  name: string;

  @ManyToMany(() => Route, (route) => route.ABStations)
  routesAB?: Route[];

  @ManyToMany(() => Route, (route) => route.BAStations)
  routesBA?: Route[];
}
