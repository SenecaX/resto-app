import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.models';
import Stripe from 'stripe';
const stripe = new Stripe(
  'sk_test_51HPougLvPqZYrxkSm6sUZr7bAutoNAiQVE2CNJPHPvvPS5idA14PV2XNoHuiVzcxNfM6DX1WdlfNZGEAEPykJvzC00hw74IV5n',
  {
    apiVersion: '2020-08-27',
  },
);

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  // async insertOrder(menuId: string, customerId: string, status: string) {
  //   const newOrder = new this.orderModel({
  //     menuId,
  //     customerId,
  //     status,
  //   });
  //   const result = await newOrder.save();
  //   return result;cardNumber
  // }
  async insertOrder(
    menuId: string,
    customerId: string,
    status: string,
    price: Number,
  ) {
    const newOrder = new this.orderModel({
      menuId,
      customerId,
      status,
      price,
    });
    const result = await newOrder.save();
    return result;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const updateOrderStatus = await this.findOrder(orderId);

    if (status) {
      updateOrderStatus.status = status;
    }
    updateOrderStatus.save();
    return updateOrderStatus;
  }

  async getOrder() {
    const order = await this.orderModel.find().exec();
    return order.map((order) => ({
      id: order.id,
      menuId: order.menuId,
      customerId: order.customerId,
      status: order.status,
    }));
  }

  async getSingleOrder(orderId: string) {
    const order = await this.findOrder(orderId);
    return {
      id: order.id,
      menuId: order.menuId,
      customerId: order.customerId,
      status: order.status,
    };
  }

  private async findOrder(id: string): Promise<Order> {
    let order;
    try {
      order = await this.orderModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find order.');
    }
    if (!order) {
      throw new NotFoundException('Could not find order.');
    }
    return order;
  }
}
