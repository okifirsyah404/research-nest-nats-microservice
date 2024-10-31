import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '../../database/entities/profile.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { ProfileController } from './controllers/profile.controller';
import { UserRepository } from './repositories/user.repository';
import { ProfileService } from './services/profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity]), AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService, UserRepository],
})
export class ProfileModule {}
