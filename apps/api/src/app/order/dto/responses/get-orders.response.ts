import { ISubOrder } from '@contracts/entities/order/sub-order.interface';
import { OrderStatusEnum } from '@contracts/enums/order-status.enum';
import { IGetOrdersRpcReply } from '@contracts/rpc/replies/order/get-orders.rpc-reply.interface';
import { IGetProduct } from '@contracts/rpc/replies/product/get-product.rpc-reply.interface';

export class GetOrdersResponse {
  id?: string;
  subOrderCount: number;
  firstProduct: IGetProduct;
  grandTotal: number;
  orderStatus?: OrderStatusEnum;
  subOrders?: ISubOrder[];

  private constructor(data: IGetOrdersRpcReply) {
    this.id = data.id;
    this.subOrderCount = data.subOrderCount;
    this.grandTotal = data.grandTotal;
    this.orderStatus = data.orderStatus;
    this.firstProduct = {
      id: data.firstProduct.id,
      name: data.firstProduct.name,
      price: data.firstProduct.price,
      stock: data.firstProduct.stock,
      image: data.firstProduct.image,
    };
    this.subOrders = data.subOrders;
  }

  static fromEntity(data: IGetOrdersRpcReply): GetOrdersResponse {
    return new GetOrdersResponse(data);
  }

  static fromEntities(data: IGetOrdersRpcReply[]): GetOrdersResponse[] {
    return data.map((item) => GetOrdersResponse.fromEntity(item));
  }
}
