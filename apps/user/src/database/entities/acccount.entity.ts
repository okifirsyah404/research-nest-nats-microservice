import { BaseEntity } from '@contracts/entities/base.entity';
import { IAccount } from '@contracts/entities/user/account.interface';
import { IUser } from '@contracts/entities/user/user.interface';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'accounts' })
export class AccountEntity extends BaseEntity implements IAccount {
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserEntity, (user) => user.account, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  user?: IUser;
}
