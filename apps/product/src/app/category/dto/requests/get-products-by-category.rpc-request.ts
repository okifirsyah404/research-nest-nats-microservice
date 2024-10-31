import { IGetProductsByCategoryRpcRequest } from '@contracts/rpc/requests/product/get-products-by-category.rpc-request.interface';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { GetCategoriesRpcRequest } from './get-categories.rpc-request';

export class GetProductsByCategoryRpcRequest
  extends GetCategoriesRpcRequest
  implements IGetProductsByCategoryRpcRequest
{
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
