import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(3, { message: 'first name too short' })
  @MaxLength(50, { message: 'first name too long' })
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(3, { message: 'last name too short' })
  @MaxLength(50, { message: 'last name too long' })
  lastName: string;

  @ApiProperty()
  @IsEmail({}, { message: 'invalid email' })
  email: string;

  @ApiProperty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'password too weak',
    },
  )
  password: string;
}
