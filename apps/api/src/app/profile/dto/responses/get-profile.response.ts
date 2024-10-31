import { IAccountWithoutPassword } from '@contracts/entities/user/account.interface';
import { IProfile } from '@contracts/entities/user/profile.interface';
import { IUser } from '@contracts/entities/user/user.interface';

export class GetProfileResponse implements IUser {
  id: string;
  profile?: IProfile;
  account?: IAccountWithoutPassword;

  private constructor(user: IUser) {
    this.id = user.id;
    this.profile = {
      id: user.profile?.id,
      name: user.profile?.name,
      phoneNumber: user.profile?.phoneNumber,
      image: user.profile?.image,
      address: user.profile?.address,
      bio: user.profile?.bio,
    };
    this.account = user.account;
  }

  static fromEntity(entity: IUser): GetProfileResponse {
    return new GetProfileResponse({
      id: entity.id,
      profile: entity.profile,
      account: {
        id: entity.account.id,
        email: entity.account.email,
      },
    });
  }
}
