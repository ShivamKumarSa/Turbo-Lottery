import { userInterface } from '@turbo-lottery/data';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto implements userInterface {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @IsString()
  @Matches(/^[A-Za-z_]*$/)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsString()
  @Matches(/(?=.*[a-z])/)
  @Matches(/(?=.*[A-Z])/)
  @Matches(/(?=.*\d)/)
  @Matches(/(?=.*[@$!%*#?&])/)
  @Matches(/^\S*$/)
  password: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  @IsOptional()
  credit: number;

  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;
}
