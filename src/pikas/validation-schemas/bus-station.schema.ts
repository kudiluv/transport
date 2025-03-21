import { z } from 'zod';

export const busStationSchema = z.object({
    id: z.string(),
    lat: z.number(),
    long: z.number(),
    name: z.string(),
});

export type BusStationSchema = z.infer<typeof busStationSchema>;
