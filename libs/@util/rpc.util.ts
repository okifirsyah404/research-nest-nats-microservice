import { NatsRpcStatusEnum } from '@contracts/enums/nats-rpc-status.enum';
import { INatsRpcException } from '@contracts/rpc/exceptions/nats-rpc-exception.interface';
import {
  IRpcPaginationReply,
  IRpcReplyWithMeta,
} from '@contracts/rpc/replies/base.rpc-reply.interface';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class RpcUtils {
  static isRpcPaginationReply<T>(
    data: unknown,
  ): data is IRpcPaginationReply<T> {
    const typeofData = data as IRpcPaginationReply<T>;

    return typeofData.pagination !== undefined;
  }

  static isNatsRpcException(data: unknown): data is INatsRpcException {
    const exception = data as INatsRpcException;
    return exception.message !== undefined && exception.status !== undefined;
  }

  static handleRpcError(error: unknown): void {
    if (!this.isErrorRpcException(error)) {
      throw new InternalServerErrorException(
        'An error occurred while processing your request.',
      );
    }

    switch (error.meta.status) {
      case NatsRpcStatusEnum.ERR_VALIDATION:
        throw new BadRequestException(error.meta.message);
      case NatsRpcStatusEnum.ERR_NOT_FOUND:
        throw new NotFoundException(error.meta.message);
      case NatsRpcStatusEnum.ERR_UNAUTHORIZED:
        throw new UnauthorizedException(error.meta.message);
      case NatsRpcStatusEnum.ERR_CONFLICT:
        throw new BadRequestException(error.meta.message);
      case NatsRpcStatusEnum.ERR_UPROCESSABLE_ENTITY:
        throw new UnprocessableEntityException(error.meta.message);
      default:
        throw new InternalServerErrorException(error.meta.message);
    }
  }

  static isErrorRpcException(
    error: unknown,
  ): error is IRpcReplyWithMeta<never> {
    return (error as IRpcReplyWithMeta<never>).meta.status !== undefined;
  }
}
