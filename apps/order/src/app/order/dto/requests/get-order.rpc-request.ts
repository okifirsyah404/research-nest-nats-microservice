import { IGetOrderRpcRequest } from '@contracts/rpc/requests/order/get-order.rpc-request.interface';
import { IsUUID, IsString, IsNotEmpty, IsJWT } from 'class-validator';

export class GetOrderRpcRequest implements IGetOrderRpcRequest {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsJWT()
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
