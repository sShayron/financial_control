import { Transform } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';

export class AuthenticateDto {
  @IsEmail({}, { message: 'email must be valid' })
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;

  @MinLength(8)
  password: string;
}
