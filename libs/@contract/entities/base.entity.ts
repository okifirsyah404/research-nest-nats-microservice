import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IBaseEntity } from './base-entity.interface';

export class BaseEntity implements IBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  updatedAt?: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt?: Date;
}
