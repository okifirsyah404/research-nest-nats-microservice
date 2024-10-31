import { IGetProductRpcRequest } from '@contracts/rpc/requests/product/get-product.rpc-request.interface';
import { IsJWT, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetProductRpcRequest implements IGetProductRpcRequest {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsJWT()
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
