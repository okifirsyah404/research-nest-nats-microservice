import {
  USER_AUTH_ACCESS_MESSAGE_PATTERN,
  USER_AUTH_SIGN_IN_MESSAGE_PATTERN,
  USER_AUTH_SIGN_UP_MESSAGE_PATTERN,
} from '@commons/constants/rpc-patterns/users/user.pattern';
import { IRpcReply } from '@contracts/rpc/replies/base.rpc-reply.interface';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthAccessRpcReply } from '../dto/replies/auth-access.rpc-reply';
import { AuthSignInRpcReply } from '../dto/replies/auth-sign-in.rpc-reply';
import { AuthSignUpRpcReply } from '../dto/replies/auth-sign-up.rpc-reply';
import { AuthAccessRpcRequest } from '../dto/requests/auth-access.rpc-request';
import { AuthSignInRpcRequest } from '../dto/requests/auth-sign-in.rpc-request';
import { AuthSignUpRpcRequest } from '../dto/requests/auth-sign-up.rpc-request';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(USER_AUTH_SIGN_IN_MESSAGE_PATTERN)
  async basicSignIn(
    @Payload() reqData: AuthSignInRpcRequest,
  ): Promise<IRpcReply<AuthSignInRpcReply>> {
    const result = await this.authService.basicSignIn(reqData);

    return {
      message: 'User signed in successfully',
      data: AuthSignInRpcReply.fromEntity(result),
    };
  }

  @MessagePattern(USER_AUTH_SIGN_UP_MESSAGE_PATTERN)
  async signUp(
    @Payload() reqData: AuthSignUpRpcRequest,
  ): Promise<IRpcReply<AuthSignUpRpcReply>> {
    const result = await this.authService.signUp(reqData);

    return {
      message: 'User signed up successfully',
      data: result,
    };
  }

  @MessagePattern(USER_AUTH_ACCESS_MESSAGE_PATTERN)
  async validateAccess(
    @Payload() reqData: AuthAccessRpcRequest,
  ): Promise<IRpcReply<AuthAccessRpcReply>> {
    const result = await this.authService.validateAccess(reqData);

    return {
      message: 'Access granted',
      data: AuthAccessRpcReply.fromEntity(result),
    };
  }
}
