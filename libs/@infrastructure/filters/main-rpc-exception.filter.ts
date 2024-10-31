import { IRpcReplyWithMeta } from '@contracts/rpc/replies/base.rpc-reply.interface';
import {
  ArgumentsHost,
  Catch,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { RpcUtils } from '@utils/rpc.util';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class MainRpcExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  private readonly logger = new Logger(MainRpcExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToRpc();
    const error = exception.getError();

    this.logger.verbose(error);

    if (!RpcUtils.isNatsRpcException(error)) {
      return throwError(() => error);
    }

    const errorResponse: IRpcReplyWithMeta<undefined> = {
      meta: {
        context: ctx.getContext().args[0],
        message: error.message,
        status: error.status,
        timestamp: Date.now(),
      },
      data: undefined,
    };

    return throwError(() => errorResponse);
  }
}
