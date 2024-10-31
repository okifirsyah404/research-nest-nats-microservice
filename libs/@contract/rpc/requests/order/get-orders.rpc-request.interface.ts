import { IIndexRpcRequest } from '../index.rpc-request.interface';

export interface IGetOrdersRpcRequest extends IIndexRpcRequest {
  status?: string;
}
