import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerModuleConfig } from '@domains/mail/config/mailerModule.config';

@Module({
  imports: [MailerModule.forRootAsync(mailerModuleConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
