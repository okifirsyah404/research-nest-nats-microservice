import {
  CREATE_ORDER_MESSAGE_PATTERN,
  ORDER_BY_ID_MESSAGE_PATTERN,
  ORDERS_MESSAGE_PATTERN,
} from '@commons/constants/rpc-patterns/orders/order.pattern';
import {
  IRpcPaginationReply,
  IRpcReply,
} from '@contracts/rpc/replies/base.rpc-reply.interface';
import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccessTokenGuard } from '../../../infrastructures/guards/access-token.guard';
import { GetOrderRpcReply } from '../dto/replies/get-order.rpc-reply';
import { GetOrdersRpcReply } from '../dto/replies/get-orders.rpc-reply';
import { CreateOrderRpcRequest } from '../dto/requests/create-order.rpc-request';
import { GetOrderRpcRequest } from '../dto/requests/get-order.rpc-request';
import { GetOrdersRpcRequest } from '../dto/requests/get-orders.rpc-request';
import { OrderService } from '../services/order.service';

@UseGuards(AccessTokenGuard)
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern(ORDERS_MESSAGE_PATTERN)
  async getOrders(
    @Payload() request: GetOrdersRpcRequest,
  ): Promise<IRpcPaginationReply<GetOrdersRpcReply>> {
    const result = await this.orderService.paginate(request);

    return {
      message: 'Successfully get orders',
      pagination: result.pagination,
      data: GetOrdersRpcReply.fromEntities(result.data),
    };
  }

  @MessagePattern(ORDER_BY_ID_MESSAGE_PATTERN)
  async getOrderById(
    @Payload() request: GetOrderRpcRequest,
  ): Promise<IRpcReply<GetOrderRpcReply>> {
    const result = await this.orderService.fetchOneOrderById(request);

    return {
      message: 'Successfully get order',
      data: GetOrderRpcReply.fromEntity(result),
    };
  }

  @MessagePattern(CREATE_ORDER_MESSAGE_PATTERN)
  async createOrder(
    @Payload() request: CreateOrderRpcRequest,
  ): Promise<IRpcReply<GetOrderRpcReply>> {
    const result = await this.orderService.createOrder(request);

    return {
      message: 'Successfully create order',
      data: GetOrderRpcReply.fromEntity(result),
    };
  }
}
