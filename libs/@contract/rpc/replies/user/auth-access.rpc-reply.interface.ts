import { IAccountWithoutPassword } from '@contracts/entities/user/account.interface';
import { IUser } from '@contracts/entities/user/user.interface';

export interface IAuthAccessRpcReply extends IUser {
  account?: IAccountWithoutPassword;
}
