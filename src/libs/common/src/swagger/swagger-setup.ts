import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { version, name, description } from 'package.json';

export interface ISwaggerSetupOption {
  prefix: string;
  app: INestApplication;
}

export class SwaggerConfig {
  private static swaggerSetupOption: ISwaggerSetupOption;

  static setup(option: ISwaggerSetupOption): void {
    this.swaggerSetupOption = option;
    const document = this.setDocumentOption();
    this.setupModule(document);
  }

  private static setDocumentOption(): Omit<OpenAPIObject, 'paths'> {
    return new DocumentBuilder()
      .setTitle(name)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth()
      .build();
  }

  private static setupModule(
    swaggerOptions: Omit<OpenAPIObject, 'paths'>,
  ): void {
    const document = SwaggerModule.createDocument(
      this.swaggerSetupOption.app,
      swaggerOptions,
    );
    SwaggerModule.setup(
      `${this.swaggerSetupOption.prefix}/docs`,
      this.swaggerSetupOption.app,
      document,
      {
        customCss: `.swagger-ui .topbar { display: none }`,
        customSiteTitle: 'Nest API Documentation',
      },
    );
  }
}
