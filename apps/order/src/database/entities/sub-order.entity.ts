import { BaseEntity } from '@contracts/entities/base.entity';
import { IOrder } from '@contracts/entities/order/order.interface';
import { ISubOrder } from '@contracts/entities/order/sub-order.interface';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('sub_orders')
export class SubOrderEntity extends BaseEntity implements ISubOrder {
  @Column({
    type: 'smallint',
  })
  quantity: number;

  @Column({
    type: 'bigint',
  })
  subTotal: number;

  @Column({
    type: 'uuid',
  })
  productId?: string;

  @Column({
    type: 'uuid',
    name: 'order_id',
  })
  orderId?: string;

  @ManyToOne(() => OrderEntity, (order) => order.subOrders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'order_id',
  })
  order?: IOrder;
}
