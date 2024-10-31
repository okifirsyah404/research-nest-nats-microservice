import { ICreateSubOrderRpcRequest } from '@contracts/rpc/requests/order/create-sub-order.rpc-request.interface';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubOrderRpcRequest implements ICreateSubOrderRpcRequest {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
