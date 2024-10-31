import { OrderStatusEnum } from '@contracts/enums/order-status.enum';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { IndexRequest } from '../../../../commons/requests/index.request';

export class GetOrdersQuery extends IndexRequest {
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(OrderStatusEnum)
  @IsOptional()
  status?: OrderStatusEnum;
}
