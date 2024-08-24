import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { version, name, description } from '../../../../../package.json';

export interface ISwaggerSetupOption {
  prefix: string;
  app: INestApplication;
}

export class SwaggerConfig {
  private static swaggerSetupOption: ISwaggerSetupOption;

  /**
   * Configures the Swagger setup with the provided options.
   *
   * @param {ISwaggerSetupOption} option - The options for the Swagger setup.
   * @return {void} No return value.
   */
  /**
   * Sets the document options for the OpenAPI specification.
   *
   * @return {Omit<OpenAPIObject, 'paths'>} The OpenAPI document options.
   */
  static setup(option: ISwaggerSetupOption): void {
    this.swaggerSetupOption = option;
    const document = this.setDocumentOption();
    this.setupModule(document);
  }

  /**
   * Sets the document options for the OpenAPI specification.
   *
   * @return {Omit<OpenAPIObject, 'paths'>} The OpenAPI document options.
   */
  private static setDocumentOption(): Omit<OpenAPIObject, 'paths'> {
    return new DocumentBuilder()
      .setTitle(name)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth()
      .build();
  }

  /**
   * Sets up the Swagger module with the provided options.
   *
   * @param {Omit<OpenAPIObject, 'paths'>} swaggerOptions - The OpenAPI document options.
   * @return {void} No return value.
   */
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
