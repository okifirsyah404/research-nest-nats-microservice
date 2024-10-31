import { ISubOrder } from '@contracts/entities/order/sub-order.interface';
import { IGetProduct } from '../product/get-product.rpc-reply.interface';

export interface ISubOrderRpcReply extends ISubOrder {
  product: IGetProduct;
}
