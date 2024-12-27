import {
  ORDER_SERVICE,
  PRODUCT_SERVICE,
  USER_SERVICE,
} from '@commons/constants/di/nats.di';
import { AppConfigModule, AppConfigService } from '@configs/app-config';
import { Module } from '@nestjs/common';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ProfileModule } from './profile/profile.module';
@Module({
  imports: [
    AppConfigModule,
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
        {
          name: ORDER_SERVICE,
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
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      renderPath: '/public',
      serveRoot: '/public',
    }),

    AuthModule,

    ProfileModule,

    ProductModule,

    OrderModule,
  ],
})
export class AppModule {}
