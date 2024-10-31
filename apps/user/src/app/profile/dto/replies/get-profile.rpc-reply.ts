import { IAccountWithoutPassword } from '@contracts/entities/user/account.interface';
import { IProfile } from '@contracts/entities/user/profile.interface';
import { IUser } from '@contracts/entities/user/user.interface';
import { IGetUserRpcReply } from '@contracts/rpc/replies/user/get-user.rpc-reply.interface';

export class GetProfileRpcReply implements IGetUserRpcReply {
  id?: string;
  profile?: IProfile;
  account?: IAccountWithoutPassword;

  constructor(partial: Partial<GetProfileRpcReply>) {
    Object.assign(this, partial);
  }

  static fromEntity(entity: IUser): GetProfileRpcReply {
    return new GetProfileRpcReply({
      id: entity.id,
      profile: entity.profile,
      account: {
        id: entity.account?.id,
        email: entity.account?.email,
      },
    });
  }
}
