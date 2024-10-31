import { IOrder } from '@contracts/entities/order/order.interface';
import { ISubOrder } from '@contracts/entities/order/sub-order.interface';
import { OrderDirectionEnum, SortEnum } from '@contracts/enums/index.enum';
import { IRpcPaginationReply } from '@contracts/rpc/replies/base.rpc-reply.interface';
import { IGetOrdersRpcRequest } from '@contracts/rpc/requests/order/get-orders.rpc-request.interface';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationUtils } from '@utils/pagination.util';
import { OrderEntity } from 'apps/order/src/database/entities/order.entity';
import { SubOrderEntity } from 'apps/order/src/database/entities/sub-order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  private readonly logger = new Logger(OrderRepository.name);

  async paginate(
    userId: string,
    request: IGetOrdersRpcRequest,
  ): Promise<IRpcPaginationReply<IOrder>> {
    const ALLOW_TO_SORT = ['created_at', 'grand_total'];

    const targetName = this.repository.metadata.targetName;

    const query = this.createQueryBuilder(targetName)
      .select()
      .leftJoinAndMapMany(
        `${targetName}.subOrders`,
        SubOrderEntity,
        'subOrders',
        `subOrders.orderId = ${targetName}.id`,
      )
      .where(`${targetName}.userId = :userId`, { userId });

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

    this.logger.log(`Query: ${query.getQuery()}`);

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

  async findOneOrderById(orderId: string): Promise<IOrder> {
    return this.findOne({
      where: { id: orderId },
      relations: ['subOrders'],
    });
  }

  async createOrder(order: IOrder, subOrders: ISubOrder[]): Promise<IOrder> {
    const _queryRunner = this.manager.connection.createQueryRunner();

    await _queryRunner.connect();

    await _queryRunner.startTransaction();

    try {
      const newOrder = await _queryRunner.manager.save(OrderEntity, order);

      for (const subOrder of subOrders) {
        await _queryRunner.manager.save(SubOrderEntity, {
          ...subOrder,
          orderId: newOrder.id,
        });
      }

      await _queryRunner.commitTransaction();

      return newOrder;
    } catch (error) {
      await _queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await _queryRunner.release();
    }
  }
}
