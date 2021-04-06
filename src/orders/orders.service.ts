import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order } from '../orders/orders.models';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async insertOrder(title: string, desc: string, price: number) {
    const newOrder = new this.orderModel({
      title,
      description: desc,
      price,
    });
    const result = await newOrder.save();
    return result;
  }

  async getOrders() {
    const orders = await this.orderModel.find().exec();
    return orders.map((order) => ({
      id: order.id,
      title: order.title,
      description: order.description,
      price: order.price,
    }));
  }

  async getSingleOrder(orderId: string) {
    const order = await this.findOrder(orderId);
    return {
      id: order.id,
      title: order.title,
      description: order.description,
      price: order.price,
    };
  }

  async updateOrder(
    orderId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updateOrder = await this.findOrder(orderId);
    if (title) {
      updateOrder.title = title;
    }
    if (desc) {
      updateOrder.description = desc;
    }
    if (price) {
      updateOrder.price = price;
    }
    updateOrder.save();
    return updateOrder;
  }

  async deleteOrder(orderId: string) {
    const result = await this.orderModel.deleteOne({ _id: orderId }).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find order.');
    }
    return true;
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
