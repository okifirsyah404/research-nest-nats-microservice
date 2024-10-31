import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { APP_CONFIG_KEY } from '../constant/config.constant';

export enum Environment {
  LOCAL = 'local',
  DEV = 'dev',
  STAGING = 'staging',
  PROD = 'prod',
  TEST = 'test',
}

export type AppConfig = {
  env: Environment;
  host: string;
  port: number;
  url: string;
};

export const registerAppConfig = registerAs(
  APP_CONFIG_KEY,
  (): AppConfig => ({
    env:
      process.env.NODE_ENV !== undefined
        ? Environment[process.env.NODE_ENV.toUpperCase()]
        : Environment.DEV,
    host: process.env.APP_API_HOST,
    port: parseInt(process.env.APP_API_PORT),
    url: `http://localhost:${process.env.APP_API_PORT}`,
  }),
);

export class AppConfigEnvironmentVariables {
  @IsDefined()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsDefined()
  @IsString()
  @MinLength(1)
  APP_API_HOST: string;

  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  APP_API_PORT: number;

  @IsDefined()
  @IsString()
  APP_API_URL: string;
}
