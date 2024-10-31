import { IAuthJwtRpcReply } from '@contracts/rpc/replies/user/auth-jwt.rpc-reply.interface';

export class AuthAccessTokenResponse {
  private constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  accessToken: string;

  static fromEntity(entity: IAuthJwtRpcReply): AuthAccessTokenResponse {
    return new AuthAccessTokenResponse(entity.accessToken);
  }
}
