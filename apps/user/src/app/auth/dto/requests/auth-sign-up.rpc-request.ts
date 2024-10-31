import { IAuthSignUpRpcRequest } from '@contracts/rpc/requests/user/auth-sign-up.rpc-request.interface';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthSignInRpcRequest } from './auth-sign-in.rpc-request';

export class AuthSignUpRpcRequest
  extends AuthSignInRpcRequest
  implements IAuthSignUpRpcRequest
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
