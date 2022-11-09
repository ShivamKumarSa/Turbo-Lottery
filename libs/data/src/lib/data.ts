import mongoose from 'mongoose';

export function data(): string {
  return 'data';
}

export interface creditHistoryInterface {
  _id?: string;
  description: string;
  transaction: string;
  balance: string;
}

export interface ticketHistoryInterface {
  _id?: string;
  winner: string;
  playedOn: string;
}

export interface userRegisterInterface {
  username: string;
  password: string;
}
export interface userInterface extends userRegisterInterface {
  credit: number;
  isAdmin: boolean;
  creditHistory?: creditHistoryInterface[];
}

export interface ticketInterface {
  _id?: mongoose.Schema.Types.ObjectId | string;
  price: number;
  maxplayers: number;
  ticketName: string;
  active: boolean;
  timer: number;
  participants?: string[];
  ticketHistory?: ticketHistoryInterface[];
}

export enum messageEnum {
  winner,
  invalid,
  message,
}
