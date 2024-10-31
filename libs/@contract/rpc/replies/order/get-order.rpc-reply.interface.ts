import { IOrder } from '@contracts/entities/order/order.interface';
import { ISubOrderRpcReply } from './sub-order.rpc-reply.interface';

export interface IGetOrderRpcReply extends IOrder {
  subOrderCount: number;
  subOrders: ISubOrderRpcReply[];
}
