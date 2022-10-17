import mongoose from 'mongoose';
import { userInterface } from '@turbo-lottery/data';

export const userSchema = new mongoose.Schema<userInterface>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credit: { type: Number, required: true, default: 1000 },
  creditHistory: {
    type: [{ description: String, transaction: String, balance: String }],
  },
  isAdmin: { type: Boolean, required: true, default: false },
});
