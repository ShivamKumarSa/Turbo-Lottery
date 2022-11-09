import { ticketInterface } from '@turbo-lottery/data';
import {
  IsBoolean,
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

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[A-Za-z0-9 ]*$/)
  ticketName: string;
}
