import { IGetUserRpcRequest } from '../user/get-user.rpc-request.interface';

export interface IDecreaseProductsQuantityRpcRequest
  extends IGetUserRpcRequest {
  data: IDecreaseProductQuantity[];
}

export interface IDecreaseProductQuantity {
  productId: string;
  quantity: number;
}
