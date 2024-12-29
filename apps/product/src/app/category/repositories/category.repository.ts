import { ICategory } from '@contracts/entities/product/category.interface';
import { OrderDirectionEnum, SortEnum } from '@contracts/enums/index.enum';
import { IRpcPaginationReply } from '@contracts/rpc/replies/base.rpc-reply.interface';
import { IGetCategoriesRpcRequest } from '@contracts/rpc/requests/product/get-categories.rpc-request.interface';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationUtils } from '@utils/pagination.util';
import { CategoryEntity } from 'apps/product/src/database/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepository extends Repository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  private readonly logger = new Logger(CategoryRepository.name);

  async paginate(
    request: IGetCategoriesRpcRequest,
  ): Promise<IRpcPaginationReply<ICategory>> {
    const ALLOW_TO_SORT = ['name', 'created_at'];
    const targetName = this.repository.metadata.targetName;

    const query = this.createQueryBuilder(targetName).select();

    if (request.search) {
      query.where(`LOWER(${targetName}.name) ILIKE :search`, {
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
