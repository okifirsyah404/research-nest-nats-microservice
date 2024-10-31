import { IProfile } from '@contracts/entities/user/profile.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'apps/user/src/database/entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileRepository extends Repository<ProfileEntity> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repository: Repository<ProfileEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async createProfile(profile: IProfile): Promise<IProfile> {
    const result: IProfile = await this.repository.save(profile);
    return result;
  }

  async updateImage(id: string, image?: string): Promise<void> {
    await this.repository.update(id, { image });
  }
}
