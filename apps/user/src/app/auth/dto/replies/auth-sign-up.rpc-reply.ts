import { IAuthJwtRpcReply } from '@contracts/rpc/replies/user/auth-jwt.rpc-reply.interface';

export class AuthSignUpRpcReply implements IAuthJwtRpcReply {
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  accessToken: string;

  static fromEntity(entity: IAuthJwtRpcReply): AuthSignUpRpcReply {
    return new AuthSignUpRpcReply(entity.accessToken);
  }
}
