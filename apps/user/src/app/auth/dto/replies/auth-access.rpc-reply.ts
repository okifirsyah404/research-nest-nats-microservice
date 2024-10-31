import { IAccountWithoutPassword } from '@contracts/entities/user/account.interface';
import { IUser } from '@contracts/entities/user/user.interface';
import { IAuthAccessRpcReply } from '@contracts/rpc/replies/user/auth-access.rpc-reply.interface';

export class AuthAccessRpcReply implements IAuthAccessRpcReply {
  id: string;
  account?: IAccountWithoutPassword;

  constructor(id: string, account?: IAccountWithoutPassword) {
    this.id = id;
    this.account = {
      id: account?.id,
      email: account?.email,
    };
  }

  static fromEntity(entity: IUser): AuthAccessRpcReply {
    return new AuthAccessRpcReply(entity.id, entity.account);
  }
}
