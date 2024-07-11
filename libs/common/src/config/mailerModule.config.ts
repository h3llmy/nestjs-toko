import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigService } from '@nestjs/config';

export const mailerModuleConfig: MailerAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    transport: {
      host: config.get<string>('MAILER_HOST'),
      service: config.get<string>('MAILER_SERVICE'),
      port: config.get<number>('MAILER_PORT'),
      secure: true,
      requireTLS: true,
      auth: {
        user: config.get<string>('MAILER_USERNAME'),
        pass: config.get<string>('MAILER_PASSWORD'),
      },
    },
    defaults: {
      from: '"No Reply" <no-reply@gmail.com>',
    },
    template: {
      adapter: new EjsAdapter(),
      dir: './views',
      options: {
        strict: false,
      },
    },
  }),
};
