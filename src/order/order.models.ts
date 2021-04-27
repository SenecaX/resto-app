import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  menuId: { type: String, required: true },
  customerId: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
  cardNumber: { type: String, required: false },
  cardExpMonth: { type: Number, required: false },
  cardExpYear: { type: Number, required: false },
  cardCvc: { type: String, required: false },
});

export interface Order extends mongoose.Document {
  id: string;
  menuId: string;
  customerId: string;
  status: string;
  price: Number;
  cardNumber?: String;
  cardExpMonth?: Number;
  cardExpYear?: Number;
  cardCvc?: String;
}
