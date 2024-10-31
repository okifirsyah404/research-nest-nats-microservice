import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateOrderRequest {
  @Type(() => CreateSubOrderRequest)
  @ArrayNotEmpty()
  @ArrayUnique((subOrder: CreateSubOrderRequest) => subOrder.productId)
  @IsArray({})
  @ValidateNested()
  subOrders: CreateSubOrderRequest[];
}

export class CreateSubOrderRequest {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
