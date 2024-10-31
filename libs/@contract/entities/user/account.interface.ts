import { IBaseEntity } from '../base-entity.interface';
import { IUser } from './user.interface';

export interface IAccount extends IBaseEntity {
  email: string;
  password: string;
  user?: IUser;
}

export interface IAccountWithoutPassword extends Omit<IAccount, 'password'> {}
