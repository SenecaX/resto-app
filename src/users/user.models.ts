import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export interface User extends mongoose.Document {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
