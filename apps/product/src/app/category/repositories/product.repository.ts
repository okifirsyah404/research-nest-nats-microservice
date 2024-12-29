import { IProduct } from '@contracts/entities/product/product.interface';
import { OrderDirectionEnum, SortEnum } from '@contracts/enums/index.enum';
import { IRpcPaginationReply } from '@contracts/rpc/replies/base.rpc-reply.interface';
import { IGetProductsByCategoryRpcRequest } from '@contracts/rpc/requests/product/get-products-by-category.rpc-request.interface';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationUtils } from '@utils/pagination.util';
import { CategoryEntity } from 'apps/product/src/database/entities/category.entity';
import { ProductEntity } from 'apps/product/src/database/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  private readonly logger = new Logger(ProductRepository.name);

  async paginateByCategoryId(
    request: IGetProductsByCategoryRpcRequest,
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
      )
      .where(`${targetName}.categoryId = :categoryId`, {
        categoryId: request.categoryId,
      });

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

    const [data, count] = await query.cache(true).getManyAndCount();

    const meta = PaginationUtils.mapMeta(count, {
      limit: request.limit,
      page: request.page,
    });

    return {
      pagination: meta,
      data,
    };
  }
}
