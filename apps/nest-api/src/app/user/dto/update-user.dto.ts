import { creditHistoryInterface, userInterface } from '@turbo-lottery/data';
import {
  IsInt,
  IsOptional,
  IsPositive,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateUserDto implements userInterface {
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  username: string;

  @IsOptional()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  @IsOptional()
  credit: number;

  @IsOptional()
  isAdmin: boolean;

  @IsOptional()
  creditHistory?: creditHistoryInterface[];
}
