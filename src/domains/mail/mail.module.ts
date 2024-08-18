import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerModuleConfig } from '@libs/common/config/mailerModule.config';

@Module({
  imports: [MailerModule.forRootAsync(mailerModuleConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
