import { z } from 'zod';
import { AppSettingsSchema } from './app-settings';
import { RedisSettingsSchema } from './redis-settings';

export const EnvSchema = AppSettingsSchema.and(RedisSettingsSchema);

export type Env = z.infer<typeof EnvSchema>;
