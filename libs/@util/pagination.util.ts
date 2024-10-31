import { OrderDirectionEnum, SortEnum } from '@contracts/enums/index.enum';
import {
  IPaginationMeta,
  IPaginationOptions,
} from '@contracts/pagination/pagination.interface';

export class PaginationUtils {
  static readonly DEFAULT_PAGE = 1;
  static readonly DEFAULT_LIMIT = 10;
  static readonly DEFAULT_SORT = SortEnum.Latest;
  static readonly DEFAULT_ORDER = OrderDirectionEnum.DESC;
  static readonly MAX_LIMIT = 100;

  static countOffset(options: IPaginationOptions | undefined): number {
    const page = options.page ?? PaginationUtils.DEFAULT_PAGE;
    const limit = options.limit ?? PaginationUtils.DEFAULT_LIMIT;

    return (page - 1) * limit;
  }

  static mapMeta(
    count: number,
    options: IPaginationOptions | undefined,
  ): IPaginationMeta {
    const page = options.page ?? PaginationUtils.DEFAULT_PAGE;
    const limit = options.limit ?? PaginationUtils.DEFAULT_LIMIT;

    const totalPages = Math.ceil(count / limit);

    return {
      page,
      limit,
      totalItems: count,
      totalPages,
    };
  }
}
