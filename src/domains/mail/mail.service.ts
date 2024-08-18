import { Order } from '@domains/orders/entities/order.entity';
import { User } from '@domains/users/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SentMessageInfo } from 'nodemailer';
import { DeepPartial } from 'typeorm';

@Injectable()
export class MailService {
  constructor(
    protected readonly mailerService: MailerService,
    protected readonly configService: ConfigService,
  ) {}

  /**
   * Sends a registration email to the user.
   *
   * @param {User} user - The user to send the registration email to.
   * @param {string} token - The token to include in the registration email.
   * @return {Promise<SentMessageInfo>} - The result of sending the email.
   */
  async sendRegisterMail(user: User, token: string): Promise<SentMessageInfo> {
    const webUrl = this.configService.get<string>('WEB_URL');
    const webVerifyRoute = this.configService.get<string>('WEB_VERIFY_ROUTE');
    const confirmationLink = `${webUrl}/${webVerifyRoute}/${token}`;

    return this.mailerService.sendMail({
      template: 'basic-auth/register',
      to: user.email,
      subject: 'Registration Email',
      context: {
        confirmationLink,
        user,
      },
    });
  }

  /**
   * Sends a forget password email to the user.
   *
   * @param {User} user - The user to send the forget password email to.
   * @param {string} token - The token to include in the forget password email.
   * @return {Promise<SentMessageInfo>} - The result of sending the email.
   */
  async sendForgetPasswordMail(
    user: User,
    token: string,
  ): Promise<SentMessageInfo> {
    const webUrl = this.configService.get<string>('WEB_URL');
    const webForgetPasswordRoute = this.configService.get<string>(
      'WEB_FORGET_PASSWORD_ROUTE',
    );

    const forgetPasswordLink = `${webUrl}/${webForgetPasswordRoute}/${token}`;

    return this.mailerService.sendMail({
      template: 'basic-auth/forget-password',
      to: user.email,
      subject: 'Forget Password',
      context: {
        forgetPasswordLink,
        user,
      },
    });
  }

  /**
   * Sends an email to the user when an order is created.
   *
   * @param {User} user - The user to send the order creation email to.
   * @param {DeepPartial<Order>} order - The order that was created.
   * @return {Promise<SentMessageInfo>} - The result of sending the email.
   */
  async sendCreateOrderMail(
    user: User,
    order: DeepPartial<Order>,
  ): Promise<SentMessageInfo> {
    return this.mailerService.sendMail({
      template: 'order/order-created',
      to: user.email,
      subject: 'Create Order',
      context: {
        user,
        order,
      },
    });
  }
}
