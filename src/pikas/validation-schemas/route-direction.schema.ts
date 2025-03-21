import { RouteType } from 'pikas/enum/route-type.enum';
import { z } from 'zod';

export const routeDirectionSchema = z.object({
    routeNum: z.string(),
    type: z.nativeEnum(RouteType),
    direction: z.string(),
    name: z.string(),
    stations: z.string().array(),
});

export type RouteDirectionSchema = z.infer<typeof routeDirectionSchema>;
