import { ICategory } from '@contracts/entities/product/category.interface';
import { IGetProduct } from '@contracts/rpc/replies/product/get-product.rpc-reply.interface';

export class GetProductResponse implements IGetProduct {
  id?: string;
  name: string;
  stock: number;
  price: number;
  image?: string;
  description?: string;
  category?: ICategory;

  private constructor(product: IGetProduct) {
    this.id = product.id;
    this.name = product.name;
    this.stock = product.stock;
    this.price = product.price;
    this.image = product.image;
    this.description = product.description;
    this.category = product.category;
  }

  static fromEntity(product: IGetProduct): GetProductResponse {
    return new GetProductResponse(product);
  }

  static fromEntities(products: IGetProduct[]): GetProductResponse[] {
    return products.map((product) => GetProductResponse.fromEntity(product));
  }
}
