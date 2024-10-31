import { AppConfigService } from '@configs/app-config';
import ApiExceptionFilter from '@infrastructures/filters/api-exception.filter';
import { apiValidationExceptionFactory } from '@infrastructures/validations/api-validation.factory';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Api Application Bootstrap');

  // app.useGlobalPipes(new ValidationPipe());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      stopAtFirstError: true,
      exceptionFactory: apiValidationExceptionFactory,
    }),
  );

  app.useGlobalFilters(new ApiExceptionFilter());

  const appConfig = app.get(AppConfigService).appConfig;

  await app.listen(appConfig.port, appConfig.host, async () => {
    logger.log(
      `Api Application is running on: ${await app.getUrl()} with ${appConfig.env} environment`,
    );
  });
}
bootstrap();
