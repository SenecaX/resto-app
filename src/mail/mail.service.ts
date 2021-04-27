import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.models';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, receipt_url: any) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject:
        'Thank you for your Order. Please find the link to your receipt below!',
      text: `
              Hello ${user.firstName},

                Please find your receipt here: ${receipt_url}.
            
              Regards,
              Lux Restaurant
      
      `,
      context: {
        name: user.firstName,
      },
    });

    return 'Email sent.';
  }
}
