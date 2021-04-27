import { UsersService } from './../users/users.service';
import { MailService } from './../mail/mail.service';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';
const chalk = require('chalk');
const stripe = require('stripe')(
  'sk_test_51HPougLvPqZYrxkSm6sUZr7bAutoNAiQVE2CNJPHPvvPS5idA14PV2XNoHuiVzcxNfM6DX1WdlfNZGEAEPykJvzC00hw74IV5n',
);
const log = console.log;

import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private mailService: MailService,
    private usersService: UsersService,
  ) {}

  @Post('checkout')
  checkout(
    @Body('menuId') menuId: string,
    @Body('customerId') customerId: string,
    @Body('status') status: string,
    @Body('price') price: Number,
    @Body('cardNumber') cardNumber: Number,
    @Body('cardExpMonth') cardExpMonth: Number,
    @Body('cardExpYear') cardExpYear: Number,
    @Body('cardCvc') cardCvc: Number,
  ) {
    const cardInfo = {
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCvc,
    };

    const orderInfo = {
      menuId,
      customerId,
      status,
      price,
    };

    // save order to mongodb with status pending
    this.orderService
      .insertOrder(menuId, customerId, status, price)
      // receive information, create token for payment
      .then(async (res) => {
        const order = res;

        log(chalk.green('Receiving order: '));
        log(chalk.green('Received order: '));
        log(
          chalk.green(`
            MenuId:   ${order._id}
            Customer: ${order.customerId}
            Status:   ${order.status}
            Price:    ${order.price}
          `),
        );

        log(chalk.yellow('Service 1............... '));
        log(chalk.green('Saving order in process............... '));
        log(chalk.green('Order Saved successfully.............. '));

        try {
          log(chalk.yellow('Service 2............... '));

          log(chalk.green("Validating customer's credit card............... "));

          const token = await stripe.tokens.create({
            card: {
              number: cardNumber,
              exp_month: cardExpMonth,
              exp_year: cardExpYear,
              cvc: cardCvc,
            },
          });

          log(chalk.green('Card Validated successfully............... '));

          return {
            order,
            token,
          };
        } catch (err) {
          console.log(`Order error: ${err}`);
          return {
            order,
            err,
          };
        }
      })
      // receive token, charge customer
      .then(async (res) => {
        // console.log('res charge customer :>> ', res);
        log(chalk.yellow('Service 3............... '));

        log(chalk.green('Processing payment............... '));
        try {
          const charge = await stripe.charges.create({
            amount: orderInfo.price,
            currency: 'usd',
            description: `Menu: ${orderInfo.menuId}`,
            source: res.token.id,
          });

          log(chalk.green('Payment processed successfully............... '));

          return {
            ...res,
            charge,
          };
        } catch (err) {
          return {
            ...res,
            err,
          };
        }
        // get user info
      })
      // update order status in mongodb
      .then(async (res) => {
        log(chalk.yellow('Service 4............... '));

        log(chalk.green("Updating order's status to success............... "));

        try {
          const updatedOrder = await this.orderService.updateOrderStatus(
            res['order']._id,
            res['charge'].status,
          );

          log(
            chalk.green("Order's status updated successfully............... "),
          );

          return {
            ...res,
            updatedOrder,
          };
        } catch (err) {
          return {
            ...res,
            err,
          };
        }
      })
      // get user
      .then(async (res) => {
        log(chalk.yellow('Service 5............... '));

        log(
          chalk.green(
            'Fetching user information by customerId............... ',
          ),
        );

        const user = await this.usersService.findUser(res.order.customerId);
        log(
          chalk.green(
            'Fetched customer information successfully............... ',
          ),
        );

        return {
          ...res,
          user,
        };
      })
      // send receipt to customer's email address if success
      .then(async (result) => {
        try {
          if (result['updatedOrder'].status === 'succeeded') {
            log(chalk.yellow('Service 6............... '));

            log(chalk.green("Sending order's receipt............... "));

            const response = await this.mailService.sendUserConfirmation(
              result.user,
              result['charge'].receipt_url,
            );

            log(
              chalk.green(
                'Receipt sent to customer successfully............... ',
              ),
            );
          }
        } catch (error) {}
      })
      .catch((err) => {
        console.log('err :>> ', err);
      });

    return 'test';
  }

  @Post()
  async addOrder(
    @Body('menuId') menuId: string,
    @Body('customerId') customerId: string,
    @Body('status') status: string,
    @Body('price') price: Number,
  ) {
    const order = await this.orderService.insertOrder(
      menuId,
      customerId,
      status,
      price,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Order added successfully',
      data: order,
    };
  }

  @Get()
  async getAllOrder() {
    const order = await this.orderService.getOrder();
    return order;
  }

  @Get(':id')
  getOrder(@Param('id') orderId: string) {
    return this.orderService.getSingleOrder(orderId);
  }
}
