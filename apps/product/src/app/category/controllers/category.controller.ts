import {
  PRODUCT_BY_CATEGORY_MESSAGE_PATTERN,
  PRODUCT_CATEGORIES_MESSAGE_PATTERN,
} from '@commons/constants/rpc-patterns/products/product.pattern';
import { IRpcPaginationReply } from '@contracts/rpc/replies/base.rpc-reply.interface';
import { Controller, Logger, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccessTokenGuard } from '../../../infrastructures/guards/access-token.guard';
import { GetCategoriesRpcReply } from '../dto/replies/get-categories.rpc-reply';
import { GetProductsByCategoryRpcReply } from '../dto/replies/get-products-by-category.rpc-reply';
import { GetCategoriesRpcRequest } from '../dto/requests/get-categories.rpc-request';
import { GetProductsByCategoryRpcRequest } from '../dto/requests/get-products-by-category.rpc-request';
import { CategoryService } from '../services/category.service';

@UseGuards(AccessTokenGuard)
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private readonly logger = new Logger(CategoryController.name);

  @MessagePattern(PRODUCT_CATEGORIES_MESSAGE_PATTERN)
  async getCategories(
    @Payload() request: GetCategoriesRpcRequest,
  ): Promise<IRpcPaginationReply<GetCategoriesRpcReply>> {
    const result = await this.categoryService.pagination(request);

    return {
      message: 'Successfully get categories',
      pagination: result.pagination,
      data: GetCategoriesRpcReply.fromEntities(result.data),
    };
  }

  @MessagePattern(PRODUCT_BY_CATEGORY_MESSAGE_PATTERN)
  async getProductsByCategory(
    @Payload() request: GetProductsByCategoryRpcRequest,
  ): Promise<IRpcPaginationReply<GetProductsByCategoryRpcReply>> {
    const result = await this.categoryService.paginationProducts(request);

    return {
      message: 'Successfully get products by category',
      pagination: result.pagination,
      data: GetProductsByCategoryRpcReply.fromEntities(result.data),
    };
  }
}
