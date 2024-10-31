import {
  DECREASE_PRODUCT_QTY_MESSAGE_PATTERN,
  DECREASE_PRODUCTS_QTY_MESSAGE_PATTERN,
  PRODUCT_BY_ID_MESSAGE_PATTERN,
  PRODUCT_QTY_MESSAGE_PATTERN,
  PRODUCTS_BY_IDS_MESSAGE_PATTERN,
  PRODUCTS_MESSAGE_PATTERN,
} from '@commons/constants/rpc-patterns/products/product.pattern';
import {
  IRpcPaginationReply,
  IRpcReply,
} from '@contracts/rpc/replies/base.rpc-reply.interface';
import { Controller, UseGuards } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AccessTokenGuard } from '../../../infrastructures/guards/access-token.guard';
import { GetProductRpcReply } from '../dto/replies/get-product.rpc-reply';
import { DecreaseProductQuantityRpcRequest } from '../dto/requests/decrease-product-quantity.rpc-request';
import { DecreaseProductsQuantityRpcRequest } from '../dto/requests/decrease-product-quantity.rpc-request copy';
import { GetProductRpcRequest } from '../dto/requests/get-product.rpc-request';
import { GetProductsRpcRequest } from '../dto/requests/get-products.rpc-request';
import { ProductService } from '../services/product.service';

@UseGuards(AccessTokenGuard)
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(PRODUCTS_MESSAGE_PATTERN)
  async getProducts(
    @Payload() request: GetProductsRpcRequest,
  ): Promise<IRpcPaginationReply<GetProductRpcReply>> {
    const result = await this.productService.paginate(request);

    return {
      message: 'Successfully get products',
      pagination: result.pagination,
      data: GetProductRpcReply.fromEntities(result.data),
    };
  }

  @MessagePattern(PRODUCT_BY_ID_MESSAGE_PATTERN)
  async getProductById(
    @Payload() request: GetProductRpcRequest,
  ): Promise<IRpcReply<GetProductRpcReply>> {
    const result = await this.productService.findOneById(request.productId);

    return {
      message: 'Successfully get product',
      data: GetProductRpcReply.fromEntity(result),
    };
  }

  @MessagePattern(PRODUCTS_BY_IDS_MESSAGE_PATTERN)
  async getProductsByIds(
    @Payload() request: GetProductsRpcRequest,
  ): Promise<IRpcReply<GetProductRpcReply[]>> {
    const result = await this.productService.findManyByIds(request.productIds);

    return {
      message: 'Successfully get products',
      data: GetProductRpcReply.fromEntities(result),
    };
  }

  @MessagePattern(PRODUCT_QTY_MESSAGE_PATTERN)
  async getProductQuantityById(
    @Payload() request: GetProductRpcRequest,
  ): Promise<IRpcReply<number>> {
    const result = await this.productService.getProductQuantity(
      request.productId,
    );

    return {
      message: 'Successfully get product quantity',
      data: result,
    };
  }

  @EventPattern(DECREASE_PRODUCT_QTY_MESSAGE_PATTERN)
  async decreaseProductQuantity(
    @Payload() request: DecreaseProductQuantityRpcRequest,
  ): Promise<IRpcReply<void>> {
    await this.productService.decreaseProductQuantity(
      request.productId,
      request.quantity,
    );

    return {
      message: 'Successfully decrease product quantity',
      data: undefined,
    };
  }

  @EventPattern(DECREASE_PRODUCTS_QTY_MESSAGE_PATTERN)
  async decreaseProductsQuantity(
    @Payload() request: DecreaseProductsQuantityRpcRequest,
  ): Promise<IRpcReply<void>> {
    await this.productService.decreaseProductsQuantity(request);

    return {
      message: 'Successfully decrease products quantities',
      data: undefined,
    };
  }
}
