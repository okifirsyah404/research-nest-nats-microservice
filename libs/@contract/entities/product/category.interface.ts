import { IBaseEntity } from '../base-entity.interface';
import { IProduct } from './product.interface';

export interface ICategory extends IBaseEntity {
  name: string;
  products?: IProduct[];
}
