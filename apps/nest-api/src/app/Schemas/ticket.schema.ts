import { ticketInterface } from '@turbo-lottery/data';
import mongoose from 'mongoose';
import { userSchema } from './user.schema';

export const ticketSchema = new mongoose.Schema<ticketInterface>({
  price: { type: Number, required: true, default: 100 },
  maxplayers: { type: Number, required: true, default: 5 },
  ticketName: { type: String, required: true, unique: true },
  priority: { type: Number, required: true, default: 10 },
  timer: { type: Number, required: true, default: 10 },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: userSchema }],
  ticketHistory: {
    type: [
      {
        winner: String,
        playedOn: String,
      },
    ],
  },
});
