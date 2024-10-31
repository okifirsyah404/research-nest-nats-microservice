import { USER_GET_PROFILE_MESSAGE_PATTERN } from '@commons/constants/rpc-patterns/users/user.pattern';
import { IUser } from '@contracts/entities/user/user.interface';
import { IRpcReplyWithMeta } from '@contracts/rpc/replies/base.rpc-reply.interface';
import { IGetUserRpcReply } from '@contracts/rpc/replies/user/get-user.rpc-reply.interface';
import { IGetUserRpcRequest } from '@contracts/rpc/requests/user/get-user.rpc-request.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RpcUtils } from '@utils/rpc.util';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProfileService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  private readonly logger = new Logger(ProfileService.name);

  async fetchProfile(accessToken: string): Promise<IUser> {
    try {
      const result = await lastValueFrom(
        this.client.send<
          IRpcReplyWithMeta<IGetUserRpcReply>,
          IGetUserRpcRequest
        >(USER_GET_PROFILE_MESSAGE_PATTERN, {
          accessToken,
        }),
      );

      return result.data;
    } catch (error) {
      RpcUtils.handleRpcError(error);
    }
  }
}
