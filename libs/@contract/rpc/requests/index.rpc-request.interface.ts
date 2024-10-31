import { OrderDirectionEnum } from '../../enums/index.enum';
import { IPaginationOptions } from '../../pagination/pagination.interface';
import { IGetUserRpcRequest } from './user/get-user.rpc-request.interface';

export interface IIndexRpcRequest
  extends IGetUserRpcRequest,
    IPaginationOptions {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: OrderDirectionEnum;
}
