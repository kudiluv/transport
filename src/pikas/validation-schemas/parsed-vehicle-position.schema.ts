import { RouteType } from 'routes/enums/route-type.enum';
import { z } from 'zod';

export const ParsedVehiclePositionSchema = z.object({
    routeType: z.nativeEnum(RouteType),
    routeNum: z.string(),
    position: z.array(z.number()),
    rotation: z.coerce.number().default(0),
    speed: z.number().default(0),
    grz: z.string(),
});
