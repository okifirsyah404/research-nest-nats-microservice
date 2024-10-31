import { ICreateOrderRpcRequest } from '@contracts/rpc/requests/order/create-order.rpc-request.interface';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsJWT,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateSubOrderRpcRequest } from './create-sub-order.rpc-request';

export class CreateOrderRpcRequest implements ICreateOrderRpcRequest {
  @IsJWT()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @Type(() => CreateSubOrderRpcRequest)
  @ArrayNotEmpty()
  @ArrayUnique((subOrder: CreateSubOrderRpcRequest) => subOrder.productId)
  @IsArray({})
  @ValidateNested()
  subOrders: CreateSubOrderRpcRequest[];
}
