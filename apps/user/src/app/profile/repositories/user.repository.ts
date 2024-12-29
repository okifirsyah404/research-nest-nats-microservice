import { AppConfigService } from '@configs/app-config';
import { IProfile } from '@contracts/entities/user/profile.interface';
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

  async findById(id: string): Promise<IUser | null> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['account', 'profile'],
      cache: true,
    });

    return result || null;
  }

  async updateProfileByUserId(
    id: string,
    profile: Partial<IProfile>,
  ): Promise<IUser | null> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['profile'],
    });

    if (!result) {
      return null;
    }

    result.profile = {
      ...result.profile,
      ...profile,
    };

    await this.repository.save(result);

    return result;
  }
}
