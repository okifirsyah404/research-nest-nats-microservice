import { OrderDirectionEnum } from '@contracts/enums/index.enum';
import { IGetOrdersRpcRequest } from '@contracts/rpc/requests/order/get-orders.rpc-request.interface';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsJWT,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetOrdersRpcRequest implements IGetOrdersRpcRequest {
  @IsJWT()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

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
