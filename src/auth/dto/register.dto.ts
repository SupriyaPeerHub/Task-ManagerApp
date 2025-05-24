import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Username is required' })
  username!: string;

  @IsEmail({}, { message: 'Email is not valid' })
  email!: string;

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;
}
