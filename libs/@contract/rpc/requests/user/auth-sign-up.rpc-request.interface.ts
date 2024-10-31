import { IAuthSignInRpcRequest } from './auth-sign-in.rpc-request.interface';

export interface IAuthSignUpRpcRequest extends IAuthSignInRpcRequest {
  name: string;
  phoneNumber: string;
  address: string;
  bio: string;
  confirmPassword: string;
}
