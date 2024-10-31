import { ISubOrder } from '@contracts/entities/order/sub-order.interface';
import { IProduct } from '@contracts/entities/product/product.interface';
import { OrderStatusEnum } from '@contracts/enums/order-status.enum';
import { IGetOrdersRpcReply } from '@contracts/rpc/replies/order/get-orders.rpc-reply.interface';

export class GetOrdersRpcReply implements IGetOrdersRpcReply {
  id?: string;
  subOrderCount: number;
  firstProduct: IProduct;
  grandTotal: number;
  orderStatus?: OrderStatusEnum;
  subOrders?: ISubOrder[];

  private constructor(data: IGetOrdersRpcReply) {
    this.id = data.id;
    this.subOrderCount = data.subOrderCount;
    this.firstProduct = data.firstProduct;
    this.grandTotal = data.grandTotal;
    this.orderStatus = data.orderStatus;
    this.subOrders = data.subOrders.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      subTotal: item.subTotal,
    }));
  }

  static fromEntity(data: IGetOrdersRpcReply): GetOrdersRpcReply {
    return new GetOrdersRpcReply(data);
  }

  static fromEntities(data: IGetOrdersRpcReply[]): GetOrdersRpcReply[] {
    return data.map((item) => GetOrdersRpcReply.fromEntity(item));
  }
}
