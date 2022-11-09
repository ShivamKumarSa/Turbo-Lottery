import { ticketHistoryInterface, ticketInterface } from '@turbo-lottery/data';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateTicketDto implements ticketInterface {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(50)
  price: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(2)
  maxplayers: number;

  // @IsOptional()
  // @IsInt()
  // @IsPositive()
  // @Min(1)
  // priority: number;
  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  timer: number;

  @IsOptional()
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[A-Za-z0-9 ]*$/)
  ticketName: string;

  @IsOptional()
  participants?: string[];

  @IsOptional()
  ticketHistory?: ticketHistoryInterface[];
}
