import { z } from 'zod';

export const AppSettingsSchema = z.object({
    APP_PORT: z.coerce.number().default(9006),
    npm_package_version: z.string(),
});
