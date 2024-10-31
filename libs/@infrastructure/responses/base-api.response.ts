import { IApiResponse } from '@contracts/api/api-response.interface';

export class BaseApiResponse<T> implements IApiResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;

  constructor(status: string, statusCode: number, message: string, data: T) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static ok<R>({
    data,
    message,
  }: {
    data: R;
    message: string;
  }): BaseApiResponse<R> {
    return new BaseApiResponse('Success', 200, message, data);
  }

  static created<R>({
    data,
    message,
  }: {
    data: R;
    message: string;
  }): BaseApiResponse<R> {
    return new BaseApiResponse('Created', 201, message, data);
  }
}
