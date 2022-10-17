import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ticketInterface } from '@turbo-lottery/data';
import mongoose, { Model } from 'mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel('ticket') private readonly ticketModel: Model<ticketInterface>
  ) {}

  checkId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }
  }

  async create(body: CreateTicketDto) {
    try {
      const ticket = new this.ticketModel({
        price: body.price,
        maxplayers: body.maxplayers,
        ticketName: body.ticketName,
        priority: body.priority,
        timer: body.timer,
      });
      const savedTicket = await ticket.save();
      const { _id, ticketName } = savedTicket;
      return { _id, ticketName };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Ticket Already Exist');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getAll() {
    try {
      const tickets = await this.ticketModel.find();
      if (!tickets || tickets.length === 0) {
        throw new NotFoundException('Tickets Not Found');
      } else {
        return tickets;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async get(ticketId: string) {
    this.checkId(ticketId);
    try {
      const ticket = await this.ticketModel.findById(ticketId);
      if (!ticket) {
        throw new NotFoundException('Ticket Not Found');
      } else {
        return ticket;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(ticketId: string, body: UpdateTicketDto) {
    this.checkId(ticketId);
    try {
      const ticket = await this.ticketModel.findByIdAndUpdate(
        ticketId,
        {
          $set: { ...body },
        },
        { new: true }
      );
      if (!ticket) {
        throw new NotFoundException('Ticket Not Found');
      } else {
        return ticket;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async updatePriority(ticketId: string, body: UpdateTicketDto) {
    try {
      const ticket = await this.update(ticketId, body);
      const { ticketName, priority } = ticket;
      return { ticketName, priority };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(ticketId: string) {
    this.checkId(ticketId);
    try {
      const ticket = await this.ticketModel.findByIdAndDelete(ticketId);
      if (!ticket) {
        throw new NotFoundException('Ticket Not Found');
      } else {
        return { msg: 'Ticket Deleted Successfully' };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
