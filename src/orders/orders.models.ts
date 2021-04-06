import * as mongoose from 'mongoose';

export const OrdersSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

export interface Order extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  price: number;
}
