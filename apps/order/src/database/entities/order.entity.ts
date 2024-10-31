import { BaseEntity } from '@contracts/entities/base.entity';
import { IOrder } from '@contracts/entities/order/order.interface';
import { ISubOrder } from '@contracts/entities/order/sub-order.interface';
import { OrderStatusEnum } from '@contracts/enums/order-status.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { SubOrderEntity } from './sub-order.entity';

@Entity('orders')
export class OrderEntity extends BaseEntity implements IOrder {
  @Column({
    type: 'bigint',
  })
  grandTotal: number;

  @OneToMany(() => SubOrderEntity, (subOrder) => subOrder.order, {
    onDelete: 'CASCADE',
  })
  subOrders?: ISubOrder[];

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  orderStatus?: OrderStatusEnum;

  @Column({
    type: 'uuid',
  })
  userId?: string;
}
