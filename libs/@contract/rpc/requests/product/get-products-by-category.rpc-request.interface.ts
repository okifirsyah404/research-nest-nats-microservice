import { IGetCategoriesRpcRequest } from './get-categories.rpc-request.interface';

export interface IGetProductsByCategoryRpcRequest
  extends IGetCategoriesRpcRequest {
  categoryId: string;
}
