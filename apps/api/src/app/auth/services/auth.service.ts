import {
  USER_AUTH_SIGN_IN_MESSAGE_PATTERN,
  USER_AUTH_SIGN_UP_MESSAGE_PATTERN,
} from '@commons/constants/rpc-patterns/users/user.pattern';
import { IRpcReplyWithMeta } from '@contracts/rpc/replies/base.rpc-reply.interface';
import { IAuthJwtRpcReply } from '@contracts/rpc/replies/user/auth-jwt.rpc-reply.interface';
import { IAuthSignInRpcRequest } from '@contracts/rpc/requests/user/auth-sign-in.rpc-request.interface';
import { IAuthSignUpRpcRequest } from '@contracts/rpc/requests/user/auth-sign-up.rpc-request.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RpcUtils } from '@utils/rpc.util';
import { lastValueFrom } from 'rxjs';
import { AuthSignInRequest } from '../dto/requests/auth-sign-in.request';
import { AuthSignUpRequest } from '../dto/requests/auth-sign-up.request';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async basicSigngin(reqData: AuthSignInRequest): Promise<IAuthJwtRpcReply> {
    try {
      const result = await lastValueFrom(
        this.client.send<
          IRpcReplyWithMeta<IAuthJwtRpcReply>,
          IAuthSignInRpcRequest
        >(USER_AUTH_SIGN_IN_MESSAGE_PATTERN, {
          email: reqData.email,
          password: reqData.password,
        }),
      );

      return result.data;
    } catch (error) {
      RpcUtils.handleRpcError(error);
    }
  }

  async signUp(reqData: AuthSignUpRequest): Promise<IAuthJwtRpcReply> {
    try {
      const result = await lastValueFrom(
        this.client.send<
          IRpcReplyWithMeta<IAuthJwtRpcReply>,
          IAuthSignUpRpcRequest
        >(USER_AUTH_SIGN_UP_MESSAGE_PATTERN, {
          email: reqData.email,
          password: reqData.password,
          confirmPassword: reqData.confirmPassword,
          name: reqData.name,
          phoneNumber: reqData.phoneNumber,
          address: reqData.address,
          bio: reqData.bio,
        }),
      );

      return result.data;
    } catch (error) {
      RpcUtils.handleRpcError(error);
    }
  }
}
