import { RouteDirection } from 'route-direction/route-direction.entity';
import { RouteType } from 'routes/enums/route-type.enum';

export type CreateRouteParams = {
    num: string;
    type: RouteType;
    directions: RouteDirection[];
};
