import { OrderDirectionEnum } from '@contracts/enums/index.enum';
import { IGetCategoriesRpcRequest } from '@contracts/rpc/requests/product/get-categories.rpc-request.interface';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsJWT,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetCategoriesRpcRequest implements IGetCategoriesRpcRequest {
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
}
