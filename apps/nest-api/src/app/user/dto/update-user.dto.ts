import { creditHistoryInterface, userInterface } from '@turbo-lottery/data';
import {
  IsBoolean,
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
  @Min(0)
  @IsOptional()
  credit: number;

  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;

  @IsOptional()
  creditHistory?: creditHistoryInterface[];
}
