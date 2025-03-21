import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { EnvService } from 'env/env.service';
import { configureSwagger } from 'common/utils/configure-swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(EnvService);

    app.useGlobalPipes(new ZodValidationPipe());
    app.enableCors();

    configureSwagger(app, 'TransportApi', '/api/docs');
    await app.listen(config.get('APP_PORT'));
}
bootstrap();
