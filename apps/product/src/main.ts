import { AppConfigService } from '@configs/app-config';
import { MainRpcExceptionFilter } from '@infrastructures/filters/main-rpc-exception.filter';
import { RpcReplyInterceptor } from '@infrastructures/interceptors/rpc-reply.interceptor';
import { rpcValidationExceptionFactory } from '@infrastructures/validations/rpc-validation.factory';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import * as fs from 'fs';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Product Service');

  const config = await AppConfigService.getNatsConfig();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        queue: 'product-service',
        servers: [config.url],
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors): void => rpcValidationExceptionFactory(errors),
    }),
  );

  app.useGlobalInterceptors(new RpcReplyInterceptor());

  app.useGlobalFilters(new MainRpcExceptionFilter());

  await app.listen().then(() => {
    logger.log(`Product Service is connected to: ${config.url}`);

    fs.writeFile('/tmp/product-service-ready', 'ready', (err) => {
      if (err) {
        logger.error(err);
      }
    });
  });
}
bootstrap();
