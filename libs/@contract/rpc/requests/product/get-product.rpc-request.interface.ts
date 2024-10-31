import { IGetUserRpcRequest } from '../user/get-user.rpc-request.interface';

export interface IGetProductRpcRequest extends IGetUserRpcRequest {
  productId: string;
}
