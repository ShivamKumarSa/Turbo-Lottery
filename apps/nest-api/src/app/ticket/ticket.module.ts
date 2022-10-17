import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ticketSchema } from '../Schemas/ticket.schema';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ticket', schema: ticketSchema }]),
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
