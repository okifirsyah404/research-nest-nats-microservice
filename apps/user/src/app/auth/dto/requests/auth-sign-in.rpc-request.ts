import { IAuthSignInRpcRequest } from '@contracts/rpc/requests/user/auth-sign-in.rpc-request.interface';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthSignInRpcRequest implements IAuthSignInRpcRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
