import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RouteType } from './enums/route-type.enum';
import { StringColumn } from 'common/decorators/db-decorators';
import { RouteDirection } from '../route-direction/route-direction.entity';

@Entity()
export class Route {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({
        comment: 'Number of route',
    })
    num: string;

    @Index()
    @StringColumn('Type of route')
    type: RouteType;

    @OneToMany(() => RouteDirection, (direction) => direction.route)
    directions: RouteDirection[];
}
