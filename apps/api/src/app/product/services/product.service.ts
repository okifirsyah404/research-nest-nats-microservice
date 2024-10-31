import { PRODUCT_SERVICE } from '@commons/constants/di/nats.di';
import {
  PRODUCT_BY_CATEGORY_MESSAGE_PATTERN,
  PRODUCT_BY_ID_MESSAGE_PATTERN,
  PRODUCT_CATEGORIES_MESSAGE_PATTERN,
  PRODUCTS_MESSAGE_PATTERN,
} from '@commons/constants/rpc-patterns/products/product.pattern';
import { IPaginationResult } from '@contracts/pagination/pagination.interface';
import {
  IRpcPaginationReplyWithMeta,
  IRpcReplyWithMeta,
} from '@contracts/rpc/replies/base.rpc-reply.interface';
import { IGetCategoriesRpcReply } from '@contracts/rpc/replies/product/get-categories.rpc-reply.interface';
import { IGetProduct } from '@contracts/rpc/replies/product/get-product.rpc-reply.interface';
import { IGetCategoriesRpcRequest } from '@contracts/rpc/requests/product/get-categories.rpc-request.interface';
import { IGetProductRpcRequest } from '@contracts/rpc/requests/product/get-product.rpc-request.interface';
import { IGetProductsByCategoryRpcRequest } from '@contracts/rpc/requests/product/get-products-by-category.rpc-request.interface';
import { IGetProductsRpcRequest } from '@contracts/rpc/requests/product/get-products.rpc-request.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RpcUtils } from '@utils/rpc.util';
import { lastValueFrom } from 'rxjs';
import { GetCategoriesQuery } from '../dto/queries/get-categories.query';
import { GetProductsQuery } from '../dto/queries/get-products.query';

@Injectable()
export class ProductService {
  constructor(@Inject(PRODUCT_SERVICE) private readonly client: ClientProxy) {}

  private readonly logger = new Logger(ProductService.name);

  async fetchProducts(
    accessToken: string,
    reqQuery: GetCategoriesQuery,
  ): Promise<IPaginationResult<IGetProduct>> {
    try {
      const result = await lastValueFrom(
        this.client.send<
          IRpcPaginationReplyWithMeta<IGetProduct>,
          IGetProductsRpcRequest
        >(PRODUCTS_MESSAGE_PATTERN, {
          accessToken,
          limit: reqQuery.limit,
          order: reqQuery.order,
          page: reqQuery.page,
          search: reqQuery.search,
          sort: reqQuery.sort,
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

  async fetchProductById(
    accessToken: string,
    productId: string,
  ): Promise<IGetProduct> {
    try {
      const result = await lastValueFrom(
        this.client.send<IRpcReplyWithMeta<IGetProduct>, IGetProductRpcRequest>(
          PRODUCT_BY_ID_MESSAGE_PATTERN,
          {
            accessToken,
            productId,
          },
        ),
      );

      this.logger.log(JSON.stringify(result));

      return result.data;
    } catch (error) {
      RpcUtils.handleRpcError(error);
    }
  }

  async fetchCategories(
    accessToken: string,
    reqQuery: GetCategoriesQuery,
  ): Promise<IPaginationResult<IGetCategoriesRpcReply>> {
    try {
      const result = await lastValueFrom(
        this.client.send<
          IRpcPaginationReplyWithMeta<IGetCategoriesRpcReply>,
          IGetCategoriesRpcRequest
        >(PRODUCT_CATEGORIES_MESSAGE_PATTERN, {
          accessToken,
          limit: reqQuery.limit,
          order: reqQuery.order,
          page: reqQuery.page,
          search: reqQuery.search,
          sort: reqQuery.sort,
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

  async fetchProductsByCategory(
    accessToken: string,
    categoryId: string,
    reqQuery: GetProductsQuery,
  ): Promise<IPaginationResult<IGetProduct>> {
    try {
      const result = await lastValueFrom(
        this.client.send<
          IRpcPaginationReplyWithMeta<IGetProduct>,
          IGetProductsByCategoryRpcRequest
        >(PRODUCT_BY_CATEGORY_MESSAGE_PATTERN, {
          accessToken,
          categoryId,
          limit: reqQuery.limit,
          order: reqQuery.order,
          page: reqQuery.page,
          search: reqQuery.search,
          sort: reqQuery.sort,
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
}
