/* eslint-disable @typescript-eslint/no-unused-vars */
import { OrderStatusEnum } from '@contracts/enums/order-status.enum';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { data } from '../../../../../seeders/raw/order-products.json';
import { userId } from '../../../../../seeders/raw/order-user-id.json';
import { OrderEntity } from '../entities/order.entity';
import { SubOrderEntity } from '../entities/sub-order.entity';

expand(dotenv.config());

export default class InitialSeeder implements Seeder {
  track?: boolean;
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Seeding Order Service initial data... 🌱');
    console.log(`userId: ${JSON.stringify(userId)}`);
    console.log(`data: ${JSON.stringify(data)}`);
    await dataSource.query('TRUNCATE "orders" RESTART IDENTITY CASCADE;');

    const orderRepo = dataSource.getRepository(OrderEntity);
    const subOrderRepo = dataSource.getRepository(SubOrderEntity);

    const orderIds: string[] = [];

    for (let i = 0; i < 10; i++) {
      const order = await orderRepo.insert([
        {
          userId: userId,
          grandTotal: 0,
          orderStatus: this.randomOrderStatus(OrderStatusEnum),
        },
      ]);
      orderIds.push(order.identifiers[0].id);
    }

    for await (const orderId of orderIds) {
      let grandTotal: number = 0;

      const randomProducts = data.slice(
        0,
        faker.number.int({
          min: 1,
          max: data.length - 1,
        }),
      );

      const subOrder: SubOrderEntity[] = randomProducts.map(
        (product, index) => {
          grandTotal += product.price;

          return {
            subTotal: product.price,
            quantity: faker.number.int({
              min: 1,
              max: 10,
            }),
            orderId: orderId,
            productId: product.id,
          };
        },
      );

      await subOrderRepo.insert(subOrder);

      await orderRepo.update(
        {
          id: orderId,
        },
        {
          grandTotal: grandTotal,
        },
      );
    }

    console.log('Order Service initial data seeded! 🌱');
  }

  private randomOrderStatus<T>(anEnum: T): T[keyof T] {
    const enumValues = Object.values(anEnum) as unknown as T[keyof T][];
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
  }
}
