import { AppConfigModule, AppConfigService } from '@configs/app-config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../../database/entities/acccount.entity';
import { ProfileEntity } from '../../database/entities/profile.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { AccountRepository } from './repositories/account.repository';
import { ProfileRepository } from './repositories/profile.repository';
import { UserRepository } from './repositories/user.repository';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, UserEntity, ProfileEntity]),
    JwtModule.registerAsync({
      global: true,
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.jwtConfig.accessSecret,
        signOptions: {
          expiresIn: config.jwtConfig.accessExpiresIn,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccountRepository,
    UserRepository,
    ProfileRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
