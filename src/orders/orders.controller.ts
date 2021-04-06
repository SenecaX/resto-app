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

import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async addOrder(
    @Body('title') orderTitle: string,
    @Body('description') orderDesc: string,
    @Body('price') orderPrice: number,
  ) {
    const order = await this.ordersService.insertOrder(
      orderTitle,
      orderDesc,
      orderPrice,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Order added successfully',
      data: order,
    };
  }

  @Get()
  async getAllOrders() {
    const orders = await this.ordersService.getOrders();
    return orders;
  }

  @Get(':id')
  getOrder(@Param('id') orderId: string) {
    return this.ordersService.getSingleOrder(orderId);
  }

  @Patch(':id')
  async updateOrder(
    @Param('id') orderId: string,
    @Body('title') orderTitle: string,
    @Body('description') orderDesc: string,
    @Body('price') orderPrice: number,
  ) {
    const order = await this.ordersService.updateOrder(
      orderId,
      orderTitle,
      orderDesc,
      orderPrice,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Order updated successfully',
      order: order,
    };
  }

  @Delete(':id')
  async removeOrder(@Param('id') orderId: string) {
    const isDeleted = await this.ordersService.deleteOrder(orderId);
    if (isDeleted) {
      return {
        statusCode: HttpStatus.OK,
        message: 'order deleted successfully',
      };
    }
  }
}
