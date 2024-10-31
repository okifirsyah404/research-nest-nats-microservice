import { NatsRpcStatusEnum } from '@contracts/enums/nats-rpc-status.enum';
import { IPaginationMeta } from '@contracts/pagination/pagination.interface';

export interface IRpcReplyMeta {
  message?: string;
  context?: string;
  status?: NatsRpcStatusEnum;
  timestamp?: number;
  pagination?: IPaginationMeta;
}

export interface IRpcReplyWithMeta<T> {
  meta: IRpcReplyMeta;
  data: T;
}

export interface IRpcReply<T> {
  message: string;
  data: T;
}

export interface IRpcPaginationReply<T> extends Partial<IRpcReply<T[]>> {
  pagination: IPaginationMeta;
  data: T[];
}

export interface IRpcPaginationReplyWithMeta<T> {
  meta: IRpcReplyMeta;
  data: T[];
}
