import { IOrder } from '@contracts/entities/order/order.interface';
import { IGetProduct } from '../product/get-product.rpc-reply.interface';

export interface IGetOrdersRpcReply extends IOrder {
  subOrderCount: number;
  firstProduct: IGetProduct;
}
