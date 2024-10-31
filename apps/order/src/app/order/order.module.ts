import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../database/entities/order.entity';
import { SubOrderEntity } from '../../database/entities/sub-order.entity';
import { OrderController } from './controllers/order.controller';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, SubOrderEntity])],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
