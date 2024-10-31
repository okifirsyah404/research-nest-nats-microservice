import { IBaseEntity } from '../base-entity.interface';
import { IAccount, IAccountWithoutPassword } from './account.interface';
import { IProfile } from './profile.interface';

export interface IUser extends IBaseEntity {
  account?: IAccount | IAccountWithoutPassword;
  profile?: IProfile;
  accountId?: string;
  profileId?: string;
}
