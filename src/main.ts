import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';
import {
  HttpExceptionsFilter,
  ValidationErrorHandler,
  JwtExceptionsFilter,
  ApplicationAdapter,
  SwaggerConfig,
} from '@libs/common';
import helmet from '@fastify/helmet';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import compression from '@fastify/compress';

(async () => {
  const routePrefix: string = 'api';
  const logger: Logger = new Logger('NestApplication', {
    timestamp: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new ApplicationAdapter(),
  );

  const configService: ConfigService = app.get(ConfigService);

  const port: number = configService.get<number>('PORT', 3000);

  app.register(helmet);
  app.register(compression);

  app.enableCors({
    origin: '*',
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
    prefix: 'v',
  });

  app.useGlobalPipes(new ValidationErrorHandler());

  app.useGlobalFilters(new HttpExceptionsFilter(), new JwtExceptionsFilter());

  app.setGlobalPrefix(routePrefix);

  SwaggerConfig.setup({
    prefix: routePrefix,
    app,
  });

  await app.listen(port, '0.0.0.0', async () => {
    const appUrl = await app.getUrl();
    logger.log(`Nest application run on ${appUrl}`);
    logger.log(`Nest documentation available on ${appUrl}/${routePrefix}/docs`);
  });

  app.enableShutdownHooks();
})();
