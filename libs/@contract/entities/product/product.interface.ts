import { IBaseEntity } from '../base-entity.interface';
import { ICategory } from './category.interface';

export interface IProduct extends IBaseEntity {
  name: string;
  stock: number;
  price: number;
  image?: string;
  description?: string;
  categoryId?: string;
  category?: ICategory;
}
