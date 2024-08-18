import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';
import { ApplicationAdapter } from '@libs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import readline from 'readline';
import { Logger } from '@nestjs/common';

// Function to prompt user for confirmation
const getConfirmation = async (question: string): Promise<boolean> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
};

(async () => {
  const logger = new Logger('Seeder');
  const app = await NestFactory.create<NestFastifyApplication>(
    SeederModule.forRoot(),
    new ApplicationAdapter(),
  );

  try {
    const configService = app.get(ConfigService);
    const nodeEnv = configService.get('NODE_ENV');

    if (nodeEnv === 'production') {
      const confirmed = await getConfirmation(
        `Seeding on ${nodeEnv} mode. Are you sure you want to continue? (y/n): `,
      );
      if (!confirmed) {
        logger.error('Seeding aborted');
        return;
      }
    }

    const seeder = app.get(SeederService);
    await seeder.runSeeder();
  } finally {
    await app.close();
  }
})();
