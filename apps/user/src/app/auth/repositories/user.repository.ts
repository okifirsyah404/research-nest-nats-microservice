import { AppConfigService } from '@configs/app-config';
import { IUser } from '@contracts/entities/user/user.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'apps/user/src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly config: AppConfigService,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async createUser(user: IUser): Promise<IUser> {
    const result: IUser = await this.repository.save(user);
    return result;
  }

  async findOneByIdAndEmail(id: string, email: string): Promise<IUser | null> {
    const result = await this.repository.findOne({
      where: {
        id,
        account: {
          email,
        },
      },
      relations: ['account'],
      cache: true,
    });

    return result || null;
  }
}
