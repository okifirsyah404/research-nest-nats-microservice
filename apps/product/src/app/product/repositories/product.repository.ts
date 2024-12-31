import { AppConfigService } from '@configs/app-config';
import { IProduct } from '@contracts/entities/product/product.interface';
import { OrderDirectionEnum, SortEnum } from '@contracts/enums/index.enum';
import { IRpcPaginationReply } from '@contracts/rpc/replies/base.rpc-reply.interface';
import { IDecreaseProductQuantity } from '@contracts/rpc/requests/product/decrease-products-quantity.rpc-request.interface';
import { IGetProductsRpcRequest } from '@contracts/rpc/requests/product/get-products.rpc-request.interface';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationUtils } from '@utils/pagination.util';
import { CategoryEntity } from 'apps/product/src/database/entities/category.entity';
import { ProductEntity } from 'apps/product/src/database/entities/product.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
    private readonly config: AppConfigService,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  private readonly logger = new Logger(ProductRepository.name);

  async paginate(
    request: IGetProductsRpcRequest,
  ): Promise<IRpcPaginationReply<IProduct>> {
    const ALLOW_TO_SORT = ['name', 'price', 'created_at'];

    const targetName = this.repository.metadata.targetName;

    const query = this.createQueryBuilder(targetName)
      .select()
      .leftJoinAndMapOne(
        `${targetName}.category`,
        CategoryEntity,
        'category',
        `${targetName}.categoryId = category.id`,
      );

    if (request.search) {
      query.andWhere(`LOWER(${targetName}.name) ILIKE :search`, {
        search: `%${request.search}%`,
      });
    }

    switch (request.sort) {
      case SortEnum.Latest:
        query.orderBy(`${targetName}.createdAt`, OrderDirectionEnum.DESC);
        break;

      case SortEnum.Oldest:
        query.orderBy(`${targetName}.createdAt`, OrderDirectionEnum.ASC);
        break;

      default:
        query.orderBy(
          ALLOW_TO_SORT.includes(request.sort)
            ? `${targetName}.${request.sort}`
            : `${targetName}.createdAt`,
          request.order,
        );
    }

    query.take(request.limit ?? PaginationUtils.DEFAULT_LIMIT).skip(
      PaginationUtils.countOffset({
        page: request.page,
        limit: request.limit,
      }),
    );

    const [data, count] = await query.getManyAndCount();

    const meta = PaginationUtils.mapMeta(count, {
      limit: request.limit,
      page: request.page,
    });

    return {
      pagination: meta,
      data,
    };
  }

  async findOneProductById(id: string): Promise<IProduct | null> {
    const result = this.findOne({
      where: { id },
      relations: ['category'],
      cache: true,
    });

    return result;
  }

  async findManyProductsByIds(ids: string[]): Promise<IProduct[]> {
    const result = await this.find({
      where: {
        id: In(ids),
      },
      relations: ['category'],
    });

    return result ?? [];
  }

  async getProductQuantityById(id: string): Promise<number> {
    const result = await this.findOne({
      cache: true,
      where: { id },
      select: ['stock'],
    });

    return result?.stock ?? 0;
  }

  async decreaseProductQuantityById(
    id: string,
    quantity: number,
  ): Promise<void> {
    await this.decrement({ id }, 'stock', quantity);
  }

  async decreaseProductsQuantityByIds(
    query: IDecreaseProductQuantity[],
  ): Promise<void> {
    const queryRunner = this.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const { productId, quantity } of query) {
        await queryRunner.manager.decrement(
          ProductEntity,
          { id: productId },
          'stock',
          quantity,
        );
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
