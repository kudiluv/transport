import { Module } from '@nestjs/common';
import { BullModule as BullModuleVendor } from '@nestjs/bullmq';
import { EnvService } from './env/env.service';

/**
 * Модуль подключения к Bull.
 */
@Module({
    imports: [
        BullModuleVendor.forRootAsync({
            inject: [EnvService],
            useFactory: async (envService: EnvService) => {
                return {
                    connection: {
                        host: envService.get('REDIS_HOST'),
                        port: envService.get('REDIS_PORT'),
                        db: envService.get('REDIS_DB'),
                        password: envService.get('REDIS_PASSWORD'),
                    },
                };
            },
        }),
    ],
})
export class BullModule {}
