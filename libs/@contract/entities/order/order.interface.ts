import { OrderStatusEnum } from '@contracts/enums/order-status.enum';
import { IBaseEntity } from '../base-entity.interface';
import { ISubOrder } from './sub-order.interface';

export interface IOrder extends IBaseEntity {
  grandTotal: number;
  subOrders?: ISubOrder[];
  orderStatus?: OrderStatusEnum;
  userId?: string;
}
