import { IGetProductRpcRequest } from './get-product.rpc-request.interface';

export interface IDecreaseProductQuantityRpcRequest
  extends IGetProductRpcRequest {
  quantity: number;
}
