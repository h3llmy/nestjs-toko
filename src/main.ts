import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';
import {
  HttpExceptionsFilter,
  ValidationErrorHandler,
  JwtExceptionsFilter,
} from '@app/common';
import helmet from '@fastify/helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import QueryString from 'qs';
import { version, name, description } from 'package.json';

(async () => {
  const routePrefix: string = 'api';
  const logger: Logger = new Logger('NestApplication', {
    timestamp: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      maxParamLength: 500,
      querystringParser: (str) => QueryString.parse(str),
    }),
  );

  const configService: ConfigService = app.get(ConfigService);

  const port: number = configService.get<number>('PORT', 3000);

  app.register(helmet);

  app.enableCors();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
    prefix: 'v',
  });

  app.useGlobalPipes(new ValidationErrorHandler());

  app.useGlobalFilters(new HttpExceptionsFilter(), new JwtExceptionsFilter());

  app.setGlobalPrefix(routePrefix);

  const options = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${routePrefix}/docs`, app, document, {
    customCss: `.swagger-ui .topbar { display: none }`,
  });

  await app.listen(port, () =>
    logger.log(`Nest application run on port ${port}`),
  );
})();
