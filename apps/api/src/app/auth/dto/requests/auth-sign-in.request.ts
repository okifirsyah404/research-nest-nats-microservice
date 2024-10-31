import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthSignInRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
