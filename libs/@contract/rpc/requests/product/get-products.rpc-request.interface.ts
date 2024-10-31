import { IIndexRpcRequest } from '../index.rpc-request.interface';

export interface IGetProductsRpcRequest extends IIndexRpcRequest {
  productIds?: string[];
}
