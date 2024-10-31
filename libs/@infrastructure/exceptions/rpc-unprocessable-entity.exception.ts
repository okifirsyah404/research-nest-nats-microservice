import { NatsRpcStatusEnum } from '@contracts/enums/nats-rpc-status.enum';
import { INatsRpcException } from '@contracts/rpc/exceptions/nats-rpc-exception.interface';
import { RpcException } from '@nestjs/microservices';

export class RpcUnprocessableEntityException extends RpcException {
  constructor(message?: string) {
    super({
      status: NatsRpcStatusEnum.ERR_UPROCESSABLE_ENTITY,
      message: message || NatsRpcStatusEnum.ERR_UPROCESSABLE_ENTITY,
    } as INatsRpcException);
  }
}
