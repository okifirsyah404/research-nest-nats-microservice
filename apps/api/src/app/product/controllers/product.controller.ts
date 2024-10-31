import {
  IApiPaginationResponse,
  IApiResponse,
} from '@contracts/api/api-response.interface';
import { BaseApiPaginationResponse } from '@infrastructures/responses/base-api-pagination.response';
import { BaseApiResponse } from '@infrastructures/responses/base-api.response';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import GetAccessToken from '../../../infrastructures/decorators/get-access-token.decorator';
import { AccessTokenGuard } from '../../../infrastructures/guards/access-token.guard';
import { GetCategoriesQuery } from '../dto/queries/get-categories.query';
import { GetProductsQuery } from '../dto/queries/get-products.query';
import { GetCategoriesResponse } from '../dto/responses/get-categories.response';
import { GetProductResponse } from '../dto/responses/get-product.response';
import { ProductService } from '../services/product.service';

@UseGuards(AccessTokenGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(
    @Query() query: GetProductsQuery,
    @GetAccessToken() accessToken: string,
  ): Promise<IApiPaginationResponse<GetProductResponse>> {
    const { data, meta } = await this.productService.fetchProducts(
      accessToken,
      query,
    );

    return BaseApiPaginationResponse.ok({
      message: 'Successfully get products',
      meta,
      data: GetProductResponse.fromEntities(data),
    });
  }

  @Get('categories')
  async getCategories(
    @Query() query: GetCategoriesQuery,
    @GetAccessToken() accessToken: string,
  ): Promise<IApiPaginationResponse<GetCategoriesResponse>> {
    const { data, meta } = await this.productService.fetchCategories(
      accessToken,
      query,
    );

    return BaseApiPaginationResponse.ok({
      message: 'Successfully get categories',
      meta,
      data: GetCategoriesResponse.fromEntities(data),
    });
  }

  @Get('categories/:categoryId')
  async getProductsByCategory(
    @Query() query: GetCategoriesQuery,
    @Param('categoryId') categoryId: string,
    @GetAccessToken() accessToken: string,
  ): Promise<IApiPaginationResponse<GetProductResponse>> {
    const { data, meta } = await this.productService.fetchProductsByCategory(
      accessToken,
      categoryId,
      query,
    );

    return BaseApiPaginationResponse.ok({
      message: 'Successfully get categories',
      meta,
      data: GetProductResponse.fromEntities(data),
    });
  }

  @Get(':productId')
  async getProductById(
    @Param('productId') productId: string,
    @GetAccessToken() accessToken: string,
  ): Promise<IApiResponse<GetProductResponse>> {
    const data = await this.productService.fetchProductById(
      accessToken,
      productId,
    );

    return BaseApiResponse.ok({
      message: 'Successfully get product',
      data: GetProductResponse.fromEntity(data),
    });
  }
}
