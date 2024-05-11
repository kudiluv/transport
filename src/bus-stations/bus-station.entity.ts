import { Route } from 'src/routes/route.entity';
import { Column, Entity, Point, PrimaryColumn } from 'typeorm';

@Entity()
export class BusStation {
  @PrimaryColumn()
  id: string;

  @Column('geometry')
  position: Point;

  @Column()
  name: string;

  routes?: Route[];
}
