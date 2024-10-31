import { OrderDirectionEnum } from '@contracts/enums/index.enum';
import { IGetProductsRpcRequest } from '@contracts/rpc/requests/product/get-products.rpc-request.interface';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsJWT,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetProductsRpcRequest implements IGetProductsRpcRequest {
  @IsJWT()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsOptional()
  search?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  sort?: string;

  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(OrderDirectionEnum)
  @IsOptional()
  order?: OrderDirectionEnum;

  @IsArray()
  @IsOptional()
  productIds?: string[];
}
