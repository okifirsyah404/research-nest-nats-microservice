import { IBaseEntity } from '../base-entity.interface';
import { IOrder } from './order.interface';

export interface ISubOrder extends IBaseEntity {
  quantity: number;
  subTotal: number;
  productId?: string;
  order?: IOrder;
  orderId?: string;
}
