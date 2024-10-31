import { IApiIndexRequest } from '@contracts/api/requests/api-index.request';
import { OrderDirectionEnum } from '@contracts/enums/index.enum';
import { PaginationUtils } from '@utils/pagination.util';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Max } from 'class-validator';

export class IndexRequest implements IApiIndexRequest {
  @IsString()
  @IsOptional()
  search?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsNumber()
  @Max(PaginationUtils.MAX_LIMIT)
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsEnum(OrderDirectionEnum)
  @IsOptional()
  order?: OrderDirectionEnum;
}
