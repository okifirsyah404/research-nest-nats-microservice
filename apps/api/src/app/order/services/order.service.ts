import { ORDER_SERVICE } from '@commons/constants/di/nats.di';
import {
  CREATE_ORDER_MESSAGE_PATTERN,
  ORDER_BY_ID_MESSAGE_PATTERN,
  ORDERS_MESSAGE_PATTERN,
} from '@commons/constants/rpc-patterns/orders/order.pattern';
import { IPaginationResult } from '@contracts/pagination/pagination.interface';
import {
  IRpcPaginationReplyWithMeta,
  IRpcReplyWithMeta,
} from '@contracts/rpc/replies/base.rpc-reply.interface';
import { IGetOrderRpcReply } from '@contracts/rpc/replies/order/get-order.rpc-reply.interface';
import { IGetOrdersRpcReply } from '@contracts/rpc/replies/order/get-orders.rpc-reply.interface';
import { ICreateOrderRpcRequest } from '@contracts/rpc/requests/order/create-order.rpc-request.interface';
import { IGetOrderRpcRequest } from '@contracts/rpc/requests/order/get-order.rpc-request.interface';
import { IGetOrdersRpcRequest } from '@contracts/rpc/requests/order/get-orders.rpc-request.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RpcUtils } from '@utils/rpc.util';
import { lastValueFrom } from 'rxjs';
import { GetOrdersQuery } from '../dto/queries/get-orders.query';
import { CreateOrderRequest } from '../dto/requests/create-order.request';

@Injectable()
export class OrderService {
  constructor(@Inject(ORDER_SERVICE) private readonly client: ClientProxy) {}

  private readonly logger = new Logger(OrderService.name);

  async fetchOrders(
    accessToken: string,
    reqQuery: GetOrdersQuery,
  ): Promise<IPaginationResult<IGetOrdersRpcReply>> {
    try {
      const result = await lastValueFrom(
        this.client.send<
          IRpcPaginationReplyWithMeta<IGetOrdersRpcReply>,
          IGetOrdersRpcRequest
        >(ORDERS_MESSAGE_PATTERN, {
          accessToken,
          limit: reqQuery.limit,
          order: reqQuery.order,
          page: reqQuery.page,
          sort: reqQuery.sort,
          status: reqQuery.status,
        }),
      );

      return {
        meta: result.meta.pagination,
        data: result.data,
      };
    } catch (error) {
      RpcUtils.handleRpcError(error);
    }
  }

  async fetchOrderById(
    accessToken: string,
    orderId: string,
  ): Promise<IGetOrderRpcReply> {
    try {
      const result = await lastValueFrom(
        this.client.send<
          IRpcReplyWithMeta<IGetOrderRpcReply>,
          IGetOrderRpcRequest
        >(ORDER_BY_ID_MESSAGE_PATTERN, {
          accessToken,
          orderId,
        }),
      );

      return result.data;
    } catch (error) {
      RpcUtils.handleRpcError(error);
    }
  }

  async createOrder(
    accessToken: string,
    request: CreateOrderRequest,
  ): Promise<IGetOrderRpcReply> {
    try {
      const result = await lastValueFrom(
        this.client.send<
          IRpcReplyWithMeta<IGetOrderRpcReply>,
          ICreateOrderRpcRequest
        >(CREATE_ORDER_MESSAGE_PATTERN, {
          accessToken,
          subOrders: request.subOrders,
        }),
      );

      return result.data;
    } catch (error) {
      RpcUtils.handleRpcError(error);
    }
  }
}
