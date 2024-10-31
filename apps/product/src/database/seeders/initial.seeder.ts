/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import * as fs from 'fs/promises';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { CategoryEntity } from '../entities/category.entity';
import { ProductEntity } from '../entities/product.entity';

expand(dotenv.config());

export default class InitialSeeder implements Seeder {
  track?: boolean;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Seeding Product Service initial data... 🌱');

    await dataSource.query('TRUNCATE "categories" RESTART IDENTITY CASCADE;');
    await dataSource.query('TRUNCATE "products" RESTART IDENTITY CASCADE;');

    const categoryRepo = dataSource.getRepository(CategoryEntity);
    const productRepo = dataSource.getRepository(ProductEntity);

    let categories: CategoryEntity[] = [];

    const productIds: {
      id: string;
      name: string;
      price: number;
    }[] = [];

    for (let i = 0; i < 10; i++) {
      const name = faker.commerce.department();
      await categoryRepo.insert([
        {
          name: name,
        },
      ]);
    }

    categories = await categoryRepo.find();

    for (let i = 0; i < 200; i++) {
      const productName = faker.commerce.productName();
      const productPrice = faker.number.int({
        min: 10,
        max: 10000,
        multipleOf: 1000,
      });

      const product = await productRepo.insert([
        {
          name: productName,
          stock: faker.number.int({
            min: 1,
            max: 100,
          }),
          price: productPrice,
          image: 'https://picsum.photos/200',
          description: faker.commerce.productDescription(),
          categoryId:
            categories[Math.floor(Math.random() * categories.length)].id,
        },
      ]);

      if (i < 10) {
        productIds.push({
          id: product.identifiers[0].id,
          name: productName,
          price: productPrice,
        });
      }
    }

    await this._generateRawOrderSeeder(productIds);

    console.log('Product Service initial data seeded! 🌱');
  }

  private async _generateRawOrderSeeder(
    product: {
      id: string;
      name: string;
      price: number;
    }[],
  ): Promise<void> {
    const rawOrderSeederPath = path.join(
      process.cwd(),
      'apps',
      'order',
      'src',
      'database',
      'seeders',
      'raw',
    );

    if (!(await fs.readdir(rawOrderSeederPath))) {
      await fs.mkdir(rawOrderSeederPath, { recursive: true });
    }

    await fs.writeFile(
      path.join(rawOrderSeederPath, 'order-products.json'),
      JSON.stringify({
        data: product,
      }),
    );
  }
}
