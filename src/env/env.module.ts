import { Global, Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule } from '@nestjs/config';
import { EnvSchema } from './validation-schemas';

@Global()
@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true, validate: (env) => EnvSchema.parse(env) })],
    providers: [EnvService],
    exports: [EnvService],
})
export class EnvModule {}
