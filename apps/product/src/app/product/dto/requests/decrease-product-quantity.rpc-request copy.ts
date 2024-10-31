import {
  IDecreaseProductQuantity,
  IDecreaseProductsQuantityRpcRequest,
} from '@contracts/rpc/requests/product/decrease-products-quantity.rpc-request.interface';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsJWT,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DecreaseProductsQuantityRpcRequest
  implements IDecreaseProductsQuantityRpcRequest
{
  @IsJWT()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @Type(() => DecreaseProductQuantity)
  @ArrayUnique((product: DecreaseProductQuantity) => product.productId)
  @ArrayNotEmpty()
  @IsArray()
  @ValidateNested()
  data: DecreaseProductQuantity[];
}

export class DecreaseProductQuantity implements IDecreaseProductQuantity {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
