import { ICategory } from '@contracts/entities/product/category.interface';
import { IProduct } from '@contracts/entities/product/product.interface';
import { IGetProduct } from '@contracts/rpc/replies/product/get-product.rpc-reply.interface';

export class GetProductRpcReply implements IGetProduct {
  private constructor(product: IGetProduct) {
    this.id = product.id;
    this.name = product.name;
    this.stock = +product.stock;
    this.price = +product.price;
    this.image = product.image;
    this.description = product.description;
    this.category = {
      id: product.category.id,
      name: product.category.name,
    };
  }

  id?: string;
  name: string;
  stock: number;
  price: number;
  image?: string;
  description?: string;
  category?: ICategory;

  static fromEntity(entity: IProduct): GetProductRpcReply {
    return new GetProductRpcReply(entity);
  }

  static fromEntities(entities: IProduct[]): GetProductRpcReply[] {
    return entities.map((entity) => GetProductRpcReply.fromEntity(entity));
  }
}
