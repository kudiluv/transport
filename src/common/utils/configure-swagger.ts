import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function configureSwagger(app: INestApplication, appName: string, appDocsUrl: string): void {
    const swaggerConfig = new DocumentBuilder()
        .setTitle(appName + ' API')
        .setDescription('API for the ' + appName)
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(appDocsUrl, app, document);
}
