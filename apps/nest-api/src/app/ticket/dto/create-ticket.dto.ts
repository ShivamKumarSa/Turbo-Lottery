import { ticketInterface } from '@turbo-lottery/data';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTicketDto implements ticketInterface {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  price: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  maxplayers: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  priority: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  timer: number;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[A-Za-z ]*$/)
  ticketName: string;
}
