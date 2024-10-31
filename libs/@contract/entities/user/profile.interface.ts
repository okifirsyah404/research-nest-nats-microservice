import { IBaseEntity } from '../base-entity.interface';
import { IUser } from './user.interface';

export interface IProfile extends IBaseEntity {
  name: string;
  phoneNumber: string;
  address: string;
  bio: string;
  image?: string;
  user?: IUser;
}
