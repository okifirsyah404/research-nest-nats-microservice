import { USER_AUTH_ACCESS_MESSAGE_PATTERN } from '@commons/constants/rpc-patterns/users/user.pattern';
import { IRpcReplyWithMeta } from '@contracts/rpc/replies/base.rpc-reply.interface';
import { IAuthAccessRpcReply } from '@contracts/rpc/replies/user/auth-access.rpc-reply.interface';
import { IGetUserRpcRequest } from '@contracts/rpc/requests/user/get-user.rpc-request.interface';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: IGetUserRpcRequest = context.switchToRpc().getData();

      const accessToken = request.accessToken;

      if (!accessToken) {
        return false;
      }

      const result = await lastValueFrom(
        this.client.send<
          IRpcReplyWithMeta<IAuthAccessRpcReply>,
          IGetUserRpcRequest
        >(USER_AUTH_ACCESS_MESSAGE_PATTERN, {
          accessToken,
        }),
      );

      if (!result.data) {
        return false;
      }

      return true;
    } catch (error) {
      if (error) {
        return false;
      }
    }
  }
}
