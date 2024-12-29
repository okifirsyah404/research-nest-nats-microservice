import { ICategory } from '@contracts/entities/product/category.interface';
import { IProduct } from '@contracts/entities/product/product.interface';
import { IRpcPaginationReply } from '@contracts/rpc/replies/base.rpc-reply.interface';
import { IGetCategoriesRpcRequest } from '@contracts/rpc/requests/product/get-categories.rpc-request.interface';
import { IGetProductsByCategoryRpcRequest } from '@contracts/rpc/requests/product/get-products-by-category.rpc-request.interface';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async pagination(
    request: IGetCategoriesRpcRequest,
  ): Promise<IRpcPaginationReply<ICategory>> {
    return this.categoryRepository.paginate(request);
  }

  async paginationProducts(
    request: IGetProductsByCategoryRpcRequest,
  ): Promise<IRpcPaginationReply<IProduct>> {
    const result = await this.productRepository.paginateByCategoryId(request);

    return {
      message: result.message,
      pagination: result.pagination,
      data: result.data.map((product) => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        price: +product.price,
        image: product.image,
        description: product.description,
        category: product.category,
      })),
    };
  }
}
