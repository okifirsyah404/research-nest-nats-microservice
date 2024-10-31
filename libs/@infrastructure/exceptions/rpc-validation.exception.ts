import { NatsRpcStatusEnum } from '@contracts/enums/nats-rpc-status.enum';
import { INatsRpcException } from '@contracts/rpc/exceptions/nats-rpc-exception.interface';
import { RpcException } from '@nestjs/microservices';

export class RpcValidationException extends RpcException {
  constructor(message?: string) {
    super({
      status: NatsRpcStatusEnum.ERR_VALIDATION,
      message: message || NatsRpcStatusEnum.ERR_VALIDATION,
    } as INatsRpcException);
  }
}
