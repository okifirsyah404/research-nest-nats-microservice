import { AppConfigModule, AppConfigService } from '@configs/app-config';
import { BullModule } from '@nestjs/bull';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisOptions } from 'ioredis';
import { dataSourceConfig } from '../database/config/typeorm.config';
import { QueueModule } from '../modules/queue/queue.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRoot({
      ...dataSourceConfig,
      autoLoadEntities: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (appConfig: AppConfigService) => {
        const store = await redisStore(<RedisOptions>{
          host: appConfig.redisConfig.host,
          port: appConfig.redisConfig.port,
          ttl: appConfig.redisConfig.ttl * 1000,
        });

        return {
          store: store as unknown as CacheStore,
          ttl: appConfig.redisConfig.ttl * 1000,
        };
      },
    }),
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => ({
        redis: {
          host: appConfig.redisConfig.host,
          port: appConfig.redisConfig.port,
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      }),
    }),
    QueueModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
