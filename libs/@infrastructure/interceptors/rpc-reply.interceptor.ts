import { NatsRpcStatusEnum } from '@contracts/enums/nats-rpc-status.enum';
import {
  IRpcPaginationReply,
  IRpcPaginationReplyWithMeta,
  IRpcReply,
  IRpcReplyWithMeta,
} from '@contracts/rpc/replies/base.rpc-reply.interface';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RpcUtils } from '@utils/rpc.util';
import { map, Observable } from 'rxjs';

@Injectable()
export class RpcReplyInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((res: IRpcReply<any> | IRpcPaginationReply<any>) => {
        const ctx = context.switchToRpc();

        if (RpcUtils.isRpcPaginationReply(res)) {
          return {
            meta: {
              context: ctx.getContext().args[0],
              status: NatsRpcStatusEnum.OK,
              message: res.message,
              timestamp: Date.now(),
              pagination: res.pagination,
            },
            data: res.data,
          } as IRpcPaginationReplyWithMeta<typeof res.data>;
        }

        return {
          meta: {
            context: ctx.getContext().args[0],
            status: NatsRpcStatusEnum.OK,
            message: res.message,
            timestamp: Date.now(),
          },
          data: res.data,
        } as IRpcReplyWithMeta<typeof res.data>;
      }),
    );
  }
}
