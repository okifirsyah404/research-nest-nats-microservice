import { BaseEntity } from '@contracts/entities/base.entity';
import { IProfile } from '@contracts/entities/user/profile.interface';
import { IUser } from '@contracts/entities/user/user.interface';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'profiles' })
export class ProfileEntity extends BaseEntity implements IProfile {
  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;

  @Column({
    type: 'text',
  })
  bio: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  image?: string;

  @OneToOne(() => UserEntity, (user) => user.profile, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  user?: IUser;
}
