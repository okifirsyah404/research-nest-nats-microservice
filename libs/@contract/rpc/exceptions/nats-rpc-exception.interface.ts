import { NatsRpcStatusEnum } from '@contracts/enums/nats-rpc-status.enum';

export interface INatsRpcException {
  status: NatsRpcStatusEnum;
  message: string;
}
