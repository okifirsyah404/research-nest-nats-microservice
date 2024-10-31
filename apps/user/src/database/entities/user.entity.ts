import { BaseEntity } from '@contracts/entities/base.entity';
import { IAccount } from '@contracts/entities/user/account.interface';
import { IProfile } from '@contracts/entities/user/profile.interface';
import { IUser } from '@contracts/entities/user/user.interface';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AccountEntity } from './acccount.entity';
import { ProfileEntity } from './profile.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity implements IUser {
  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'uuid', nullable: true })
  profileId: string;

  @OneToOne(() => AccountEntity, (account) => account.user, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({
    name: 'account_id',
  })
  account?: IAccount;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({
    name: 'profile_id',
  })
  profile?: IProfile;
}
