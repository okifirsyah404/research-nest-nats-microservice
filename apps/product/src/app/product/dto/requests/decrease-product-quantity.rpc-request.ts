import { IDecreaseProductQuantityRpcRequest } from '@contracts/rpc/requests/product/decrease-product-quantity.rpc-request.interface';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { GetProductRpcRequest } from './get-product.rpc-request';

export class DecreaseProductQuantityRpcRequest
  extends GetProductRpcRequest
  implements IDecreaseProductQuantityRpcRequest
{
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
