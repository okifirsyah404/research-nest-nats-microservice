import { OrderStatusEnum } from '@contracts/enums/order-status.enum';
import { IGetOrderRpcReply } from '@contracts/rpc/replies/order/get-order.rpc-reply.interface';
import { ISubOrderRpcReply } from '@contracts/rpc/replies/order/sub-order.rpc-reply.interface';

export class GetOrderResponse {
  id?: string;
  subOrderCount: number;
  grandTotal: number;
  orderStatus?: OrderStatusEnum;
  subOrders: ISubOrderRpcReply[];

  private constructor(data: IGetOrderRpcReply) {
    this.id = data.id;
    this.subOrderCount = data.subOrderCount;
    this.grandTotal = data.grandTotal;
    this.orderStatus = data.orderStatus;
    this.subOrders = data.subOrders.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      subTotal: item.subTotal,
      product: item.product,
    }));
  }

  static fromEntity(data: IGetOrderRpcReply): GetOrderResponse {
    return new GetOrderResponse(data);
  }
}
