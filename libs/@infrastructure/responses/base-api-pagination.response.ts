import { IApiPaginationResponse } from '@contracts/api/api-response.interface';
import { IPaginationMeta } from '@contracts/pagination/pagination.interface';

export class BaseApiPaginationResponse<T> implements IApiPaginationResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  pagination: IPaginationMeta;
  data: T[];

  constructor(
    status: string,
    statusCode: number,
    message: string,
    pagination: IPaginationMeta,
    data: T[],
  ) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.pagination = pagination;
    this.data = data;
  }

  static ok<R>({
    data,
    meta,
    message,
  }: {
    data: R[];
    meta: IPaginationMeta;
    message: string;
  }): BaseApiPaginationResponse<R> {
    return new BaseApiPaginationResponse('Success', 200, message, meta, data);
  }
}
