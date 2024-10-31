import {
  IApiPaginationResponse,
  IApiResponse,
} from '@contracts/api/api-response.interface';
import { BaseApiPaginationResponse } from '@infrastructures/responses/base-api-pagination.response';
import { BaseApiResponse } from '@infrastructures/responses/base-api.response';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import GetAccessToken from '../../../infrastructures/decorators/get-access-token.decorator';
import { AccessTokenGuard } from '../../../infrastructures/guards/access-token.guard';
import { GetOrdersQuery } from '../dto/queries/get-orders.query';
import { CreateOrderRequest } from '../dto/requests/create-order.request';
import { GetOrderResponse } from '../dto/responses/get-order.response';
import { GetOrdersResponse } from '../dto/responses/get-orders.response';
import { OrderService } from '../services/order.service';

@UseGuards(AccessTokenGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getOrders(
    @Query() query: GetOrdersQuery,
    @GetAccessToken() accessToken: string,
  ): Promise<IApiPaginationResponse<GetOrdersResponse>> {
    const { data, meta } = await this.orderService.fetchOrders(
      accessToken,
      query,
    );

    return BaseApiPaginationResponse.ok({
      message: 'Successfully get orders',
      meta,
      data: GetOrdersResponse.fromEntities(data),
    });
  }

  @Get(':orderId')
  async getOrderById(
    @GetAccessToken() accessToken: string,
    @Param('orderId') orderId: string,
  ): Promise<IApiResponse<GetOrderResponse>> {
    const data = await this.orderService.fetchOrderById(accessToken, orderId);

    return BaseApiResponse.ok({
      message: 'Successfully get order',
      data: GetOrderResponse.fromEntity(data),
    });
  }

  @Post()
  async createOrder(
    @GetAccessToken() accessToken: string,
    @Body() reqBody: CreateOrderRequest,
  ): Promise<IApiResponse<GetOrderResponse>> {
    const result = await this.orderService.createOrder(accessToken, reqBody);

    return BaseApiResponse.created({
      message: 'Successfully create order',
      data: GetOrderResponse.fromEntity(result),
    });
  }
}
