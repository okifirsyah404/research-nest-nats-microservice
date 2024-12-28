import { IProduct } from '@contracts/entities/product/product.interface';
import { IRpcPaginationReply } from '@contracts/rpc/replies/base.rpc-reply.interface';
import { IDecreaseProductsQuantityRpcRequest } from '@contracts/rpc/requests/product/decrease-products-quantity.rpc-request.interface';
import { IGetProductsRpcRequest } from '@contracts/rpc/requests/product/get-products.rpc-request.interface';
import { RpcNotFoundException } from '@infrastructures/exceptions/rpc-not-found.exception';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly productRepository: ProductRepository,
  ) {}

  async paginate(
    request: IGetProductsRpcRequest,
  ): Promise<IRpcPaginationReply<IProduct>> {
    return this.productRepository.paginate(request);
  }

  async findOneById(id: string): Promise<IProduct> {
    const cachedProduct: IProduct = await this.cacheManager.get(
      `product:${id}`,
    );

    if (cachedProduct) {
      return cachedProduct;
    }

    const result = await this.productRepository.findOneProductById(id);

    if (!result) {
      throw new RpcNotFoundException('Product not found');
    }

    this.cacheManager.set(`product:${id}`, result);

    return result;
  }

  async findManyByIds(ids: string[]): Promise<IProduct[]> {
    const result = this.productRepository.findManyProductsByIds(ids);
    return result;
  }

  async getProductQuantity(productId: string): Promise<number> {
    return this.productRepository.getProductQuantityById(productId);
  }

  async decreaseProductQuantity(
    productId: string,
    quantity: number,
  ): Promise<void> {
    await this.productRepository.decreaseProductQuantityById(
      productId,
      quantity,
    );
  }

  async decreaseProductsQuantity(
    request: IDecreaseProductsQuantityRpcRequest,
  ): Promise<void> {
    await this.productRepository.decreaseProductsQuantityByIds(request.data);
  }
}
