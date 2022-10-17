import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/Guards/jwt-auth.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    return await this.ticketService.create(createTicketDto);
  }

  @Get()
  async getTickets() {
    return await this.ticketService.getAll();
  }

  @Get(':ticketId')
  async getTicket(@Param('ticketId') ticketId: string) {
    return await this.ticketService.get(ticketId);
  }

  @Put(':ticketId')
  async updateTicket(
    @Param('ticketId') ticketId: string,
    @Body() updateTicketDto: UpdateTicketDto
  ) {
    return await this.ticketService.updatePriority(ticketId, updateTicketDto);
  }

  @Delete(':ticketId')
  async deleteUser(@Param('ticketId') ticketId: string) {
    return await this.ticketService.delete(ticketId);
  }
}
