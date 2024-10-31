import { BaseEntity } from '@contracts/entities/base.entity';
import { ICategory } from '@contracts/entities/product/category.interface';
import { IProduct } from '@contracts/entities/product/product.interface';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity('products')
export class ProductEntity extends BaseEntity implements IProduct {
  @Column()
  name: string;

  @Column({
    type: 'int',
  })
  stock: number;

  @Column({
    type: 'int8',
  })
  price: number;

  @Column({
    nullable: true,
  })
  image?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'uuid',
    name: 'category_id',
  })
  categoryId?: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'category_id',
  })
  category?: ICategory;
}
