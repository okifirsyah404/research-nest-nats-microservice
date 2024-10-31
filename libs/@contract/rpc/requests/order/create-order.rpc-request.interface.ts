import { IGetUserRpcRequest } from '../user/get-user.rpc-request.interface';
import { ICreateSubOrderRpcRequest } from './create-sub-order.rpc-request.interface';

export interface ICreateOrderRpcRequest extends IGetUserRpcRequest {
  subOrders: ICreateSubOrderRpcRequest[];
}
