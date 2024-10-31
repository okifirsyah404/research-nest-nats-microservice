import { BaseEntity } from '@contracts/entities/base.entity';
import { ICategory } from '@contracts/entities/product/category.interface';
import { IProduct } from '@contracts/entities/product/product.interface';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity implements ICategory {
  @Column()
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.category, {
    onDelete: 'CASCADE',
  })
  products?: IProduct[];
}
