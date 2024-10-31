import { IGetUserRpcRequest } from '@contracts/rpc/requests/user/get-user.rpc-request.interface';
import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class GetProfileRpcRequest implements IGetUserRpcRequest {
  @IsJWT()
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
