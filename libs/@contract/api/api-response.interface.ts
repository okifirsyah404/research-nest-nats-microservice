import { IPaginationMeta } from '@contracts/pagination/pagination.interface';

export interface IApiResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
}

export interface IApiPaginationResponse<T> extends IApiResponse<T[]> {
  pagination: IPaginationMeta;
  data: T[];
}
