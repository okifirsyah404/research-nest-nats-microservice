import { OrderDirectionEnum } from '@contracts/enums/index.enum';
import { IPaginationOptions } from '@contracts/pagination/pagination.interface';

export interface IApiIndexRequest extends IPaginationOptions {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: OrderDirectionEnum;
}
