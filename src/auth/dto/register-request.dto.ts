import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50, { message: 'first name too long' })
  firstName: string;

  @ApiProperty()
  @IsString()
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
