import { PRODUCT_SERVICE, USER_SERVICE } from '@commons/constants/di/nats.di';
import { AppConfigModule, AppConfigService } from '@configs/app-config';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-ioredis-yet';
import { dataSourceConfig } from '../database/config/typeorm.config';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRoot({
      ...dataSourceConfig,
      autoLoadEntities: true,
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: USER_SERVICE,
          imports: [AppConfigModule],
          inject: [AppConfigService],
          useFactory: (
            configService: AppConfigService,
          ): Promise<ClientProvider> | ClientProvider => ({
            transport: Transport.NATS,
            options: {
              servers: [configService.natsConfig.url],
            },
          }),
        },
        {
          name: PRODUCT_SERVICE,
          imports: [AppConfigModule],
          inject: [AppConfigService],
          useFactory: (
            configService: AppConfigService,
          ): Promise<ClientProvider> | ClientProvider => ({
            transport: Transport.NATS,
            options: {
              servers: [configService.natsConfig.url],
            },
          }),
        },
      ],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (appConfig: AppConfigService) => {
        const store = await redisStore({
          socket: {
            host: appConfig.redisConfig.host,
            port: appConfig.redisConfig.port,
          },
          ttl: appConfig.redisConfig.ttl * 1000,
        });

        return {
          store: store as unknown as CacheStore,
          ttl: appConfig.redisConfig.ttl * 1000,
        };
      },
    }),

    OrderModule,
  ],
})
export class AppModule {}
