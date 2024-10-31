import { IAuthJwtRpcReply } from '@contracts/rpc/replies/user/auth-jwt.rpc-reply.interface';

export class AuthSignInRpcReply implements IAuthJwtRpcReply {
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  accessToken: string;

  static fromEntity(entity: IAuthJwtRpcReply): AuthSignInRpcReply {
    return new AuthSignInRpcReply(entity.accessToken);
  }
}
