import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../../database/entities/category.entity';
import { ProductEntity } from '../../database/entities/product.entity';
import { CategoryController } from './controllers/category.controller';
import { CategoryRepository } from './repositories/category.repository';
import { ProductRepository } from './repositories/product.repository';
import { CategoryService } from './services/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, ProductEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, ProductRepository],
})
export class CategoryModule {}
