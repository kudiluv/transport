import { z } from 'zod';

export const RedisSettingsSchema = z.object({
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_DB: z.coerce.number(),
    REDIS_PASSWORD: z.string(),
});
