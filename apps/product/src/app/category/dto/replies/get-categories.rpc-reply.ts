import { ICategory } from '@contracts/entities/product/category.interface';
import { IGetCategoriesRpcReply } from '@contracts/rpc/replies/product/get-categories.rpc-reply.interface';

export class GetCategoriesRpcReply implements IGetCategoriesRpcReply {
  id?: string;
  name: string;

  static fromEntity(entity: ICategory): GetCategoriesRpcReply {
    return {
      id: entity.id,
      name: entity.name,
    };
  }

  static fromEntities(entities: ICategory[]): GetCategoriesRpcReply[] {
    return entities.map((entity) => GetCategoriesRpcReply.fromEntity(entity));
  }
}
