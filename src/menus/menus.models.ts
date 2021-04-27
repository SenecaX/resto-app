import * as mongoose from 'mongoose';

export const MenusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

export interface Menu extends mongoose.Document {
  id: string;
  name: string;
  description: string;
  price: number;
}
