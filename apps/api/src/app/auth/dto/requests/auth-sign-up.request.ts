import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class AuthSignUpRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber('ID')
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  bio: string;
}
