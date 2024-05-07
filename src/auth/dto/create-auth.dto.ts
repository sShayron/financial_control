import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNumberString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @MinLength(5)
  @MaxLength(60)
  @Matches(/^([A-Za-z]+(\s[A-Za-z]+)*)$/, {
    message: 'name must contain only letters and spaces',
  })
  @Transform(({ value }) =>
    String(value).trim().toUpperCase().replace(/\s+/g, ' '),
  )
  name: string;

  @IsEmail({}, { message: 'email must be valid' })
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;

  @MinLength(8)
  password: string;

  @IsNumberString()
  @Matches(/^\d{11}$/, {
    message: 'phoneNumber must match the following format 11999999999.',
  })
  @Transform(({ value }) => String(value).trim())
  phoneNumber: string;
}
