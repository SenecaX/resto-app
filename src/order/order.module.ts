import { MailModule } from './../mail/mail.module';
import { UsersModule } from './../users/users.module';
import { MailService } from './../mail/mail.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderController } from './order.controller';
import { OrderSchema } from './order.models';
import { OrderService } from './order.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    UsersModule,
    MailModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
