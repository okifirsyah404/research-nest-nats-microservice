import { ICategory } from '@contracts/entities/product/category.interface';

export class GetCategoriesResponse implements ICategory {
  id?: string;
  name: string;

  private constructor(category: ICategory) {
    this.id = category.id;
    this.name = category.name;
  }

  static fromEntity(category: ICategory): GetCategoriesResponse {
    return new GetCategoriesResponse(category);
  }

  static fromEntities(categories: ICategory[]): GetCategoriesResponse[] {
    return categories.map((category) =>
      GetCategoriesResponse.fromEntity(category),
    );
  }
}
