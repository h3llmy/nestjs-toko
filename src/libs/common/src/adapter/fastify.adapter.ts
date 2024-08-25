import { FastifyAdapter } from '@nestjs/platform-fastify';
import QueryString from 'qs';

export class ApplicationAdapter extends FastifyAdapter {
  constructor() {
    super({
      maxParamLength: 500,
      querystringParser: (str) => QueryString.parse(str),
      logger: {
        file: 'logs/app.log',
      },
    });
  }
}
