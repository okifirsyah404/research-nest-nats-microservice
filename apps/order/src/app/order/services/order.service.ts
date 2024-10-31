import { PRODUCT_SERVICE, USER_SERVICE } from '@commons/constants/di/nats.di';
import {
  DECREASE_PRODUCTS_QTY_MESSAGE_PATTERN,
  PRODUCT_BY_ID_MESSAGE_PATTERN,
  PRODUCTS_BY_IDS_MESSAGE_PATTERN,
} from '@commons/constants/rpc-patterns/products/product.pattern';
import { USER_AUTH_ACCESS_MESSAGE_PATTERN } from '@commons/constants/rpc-patterns/users/user.pattern';
import { IOrder } from '@contracts/entities/order/order.interface';
import { ISubOrder } from '@contracts/entities/order/sub-order.interface';
import {
  IRpcPaginationReply,
  IRpcReplyWithMeta,
} from '@contracts/rpc/replies/base.rpc-reply.interface';
import { IGetOrderRpcReply } from '@contracts/rpc/replies/order/get-order.rpc-reply.interface';
import { IGetOrdersRpcReply } from '@contracts/rpc/replies/order/get-orders.rpc-reply.interface';
import { ISubOrderRpcReply } from '@contracts/rpc/replies/order/sub-order.rpc-reply.interface';
import { IGetProduct } from '@contracts/rpc/replies/product/get-product.rpc-reply.interface';
import { IAuthAccessRpcReply } from '@contracts/rpc/replies/user/auth-access.rpc-reply.interface';
import { ICreateOrderRpcRequest } from '@contracts/rpc/requests/order/create-order.rpc-request.interface';
import { IGetOrderRpcRequest } from '@contracts/rpc/requests/order/get-order.rpc-request.interface';
import { IGetOrdersRpcRequest } from '@contracts/rpc/requests/order/get-orders.rpc-request.interface';
import { IDecreaseProductsQuantityRpcRequest } from '@contracts/rpc/requests/product/decrease-products-quantity.rpc-request.interface';
import { IGetProductRpcRequest } from '@contracts/rpc/requests/product/get-product.rpc-request.interface';
import { IGetProductsRpcRequest } from '@contracts/rpc/requests/product/get-products.rpc-request.interface';
import { IGetUserRpcRequest } from '@contracts/rpc/requests/user/get-user.rpc-request.interface';
import { RpcNotFoundException } from '@infrastructures/exceptions/rpc-not-found.exception';
import { RpcUnprocessableEntityException } from '@infrastructures/exceptions/rpc-unprocessable-entity.exception';
import { RpcValidationException } from '@infrastructures/exceptions/rpc-validation.exception';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RpcUtils } from '@utils/rpc.util';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { OrderRepository } from '../repositories/order.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientProxy,
    @Inject(USER_SERVICE) private readonly userClient: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly orderRepository: OrderRepository,
  ) {}

  private readonly logger = new Logger(OrderService.name);

  async paginate(
    request: IGetOrdersRpcRequest,
  ): Promise<IRpcPaginationReply<IGetOrdersRpcReply>> {
    const accessUser = await this._getAccessUser(request.accessToken);

    const result = await this.orderRepository.paginate(accessUser.id, request);

    const formattedOrders: IGetOrdersRpcReply[] = [];

    for (const order of result.data) {
      try {
        const productSample = await lastValueFrom(
          this.productClient.send<
            IRpcReplyWithMeta<IGetProduct>,
            IGetProductRpcRequest
          >(PRODUCT_BY_ID_MESSAGE_PATTERN, {
            accessToken: request.accessToken,
            productId: order.subOrders[0].productId,
          }),
        );

        formattedOrders.push({
          id: order.id,
          grandTotal: +order.grandTotal,
          orderStatus: order.orderStatus,
          subOrderCount: order.subOrders.length ?? 0,
          subOrders: order.subOrders,
          firstProduct: productSample.data,
        });
      } catch (error) {
        if (RpcUtils.isErrorRpcException(error)) {
          throw new RpcUnprocessableEntityException(error.meta.message);
        }
      }
    }

    return {
      pagination: result.pagination,
      data: formattedOrders,
    };
  }

  async fetchOneOrderById(
    request: IGetOrderRpcRequest,
  ): Promise<IGetOrderRpcReply> {
    const cachedResult: IGetOrderRpcReply = await this.cacheManager.get(
      `order:${request.orderId}`,
    );

    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.orderRepository.findOneOrderById(request.orderId);

    if (!result) {
      throw new RpcNotFoundException('Order not found');
    }

    const formattedSubOrders: ISubOrderRpcReply[] = [];

    for (const subOrder of result.subOrders) {
      try {
        const product = await lastValueFrom(
          this.productClient.send<
            IRpcReplyWithMeta<IGetProduct>,
            IGetProductRpcRequest
          >(PRODUCT_BY_ID_MESSAGE_PATTERN, {
            accessToken: request.accessToken,
            productId: subOrder.productId,
          }),
        );

        formattedSubOrders.push({
          id: subOrder.id,
          quantity: subOrder.quantity,
          subTotal: +subOrder.subTotal,
          product: product.data,
          productId: subOrder.productId,
        });
      } catch (error) {
        if (RpcUtils.isErrorRpcException(error)) {
          throw new RpcUnprocessableEntityException(error.meta.message);
        }
      }
    }

    const formattedOrder: IGetOrderRpcReply = {
      id: result.id,
      grandTotal: result.grandTotal,
      orderStatus: result.orderStatus,
      subOrderCount: formattedSubOrders.length,
      subOrders: formattedSubOrders,
    };

    this.cacheManager.set(`order:${request.orderId}`, formattedOrder);

    return formattedOrder;
  }

  async createOrder(
    request: ICreateOrderRpcRequest,
  ): Promise<IGetOrderRpcReply> {
    const accessUser = await this._getAccessUser(request.accessToken);

    const subOrders: ISubOrder[] = [];

    const productsRes = await lastValueFrom(
      this.productClient.send<
        IRpcReplyWithMeta<IGetProduct[]>,
        IGetProductsRpcRequest
      >(PRODUCTS_BY_IDS_MESSAGE_PATTERN, {
        accessToken: request.accessToken,
        productIds: request.subOrders.map((subOrder) => subOrder.productId),
      }),
    ).catch((error) => {
      if (RpcUtils.isErrorRpcException(error)) {
        throw new RpcUnprocessableEntityException(error.meta.message);
      }
    });

    if (!productsRes) {
      throw new RpcNotFoundException('Products not found');
    }

    for (const product of productsRes.data) {
      const subOrder = request.subOrders.find(
        (_subOrder) => _subOrder.productId === product.id,
      );

      if (!subOrder || subOrder.quantity > product.stock) {
        throw new RpcValidationException(
          `Product ${product.name} with id ${product.id} is out of stock`,
        );
      }

      subOrders.push({
        productId: product.id,
        quantity: subOrder.quantity,
        subTotal: product.price * subOrder.quantity,
      });
    }

    const order: IOrder = {
      grandTotal: subOrders.reduce(
        (acc, subOrder) => acc + subOrder.subTotal,
        0,
      ),
      userId: accessUser.id,
      subOrders: subOrders,
    };

    const orderResult = await this.orderRepository.createOrder(
      order,
      subOrders,
    );

    if (!orderResult) {
      throw new RpcUnprocessableEntityException('Failed to create order');
    }

    this.productClient.emit<void, IDecreaseProductsQuantityRpcRequest>(
      DECREASE_PRODUCTS_QTY_MESSAGE_PATTERN,
      {
        accessToken: request.accessToken,
        data: subOrders.map((subOrder) => ({
          productId: subOrder.productId,
          quantity: subOrder.quantity,
        })),
      },
    );

    return {
      ...orderResult,
      subOrderCount: orderResult.subOrders.length,
      subOrders: orderResult.subOrders.map((subOrder) => ({
        ...subOrder,
        product: productsRes.data.find(
          (product) => product.id === subOrder.productId,
        ),
      })),
    };
  }

  private async _getAccessUser(
    accessToken: string,
  ): Promise<IAuthAccessRpcReply> {
    try {
      const cachedResult: IAuthAccessRpcReply = await this.cacheManager.get(
        `orderUser:${accessToken}`,
      );

      if (cachedResult) {
        return cachedResult;
      }

      const result = await lastValueFrom(
        this.userClient.send<
          IRpcReplyWithMeta<IAuthAccessRpcReply>,
          IGetUserRpcRequest
        >(USER_AUTH_ACCESS_MESSAGE_PATTERN, {
          accessToken,
        }),
      );

      this.cacheManager.set(`orderUser:${accessToken}`, result.data);

      return result.data;
    } catch (error) {
      if (RpcUtils.isErrorRpcException(error)) {
        throw new UnauthorizedException(error.meta.message);
      }
    }
  }
}
