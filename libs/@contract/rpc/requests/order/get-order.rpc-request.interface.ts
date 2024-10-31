import { IGetUserRpcRequest } from '../user/get-user.rpc-request.interface';

export interface IGetOrderRpcRequest extends IGetUserRpcRequest {
  orderId: string;
}
