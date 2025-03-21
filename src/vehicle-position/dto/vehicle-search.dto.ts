import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class VehicleSearchDto extends createZodDto(
    z.object({
        position: z
            .object({
                type: z.literal('Point'),
                coordinates: z.tuple([z.coerce.number(), z.coerce.number()]),
            })
            .optional(),
        buses: z.coerce.number().array().default([]),
    }),
) {}
