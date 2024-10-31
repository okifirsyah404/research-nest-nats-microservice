import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString } from 'class-validator';
import { REDIS_CONFIG_KEY } from '../constant/config.constant';

export type RedisConfig = {
  host: string;
  port: number;
  url: string;
  ttl: number;
};

export const registerRedisConfig = registerAs(
  REDIS_CONFIG_KEY,
  (): RedisConfig => ({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    url: process.env.REDIS_URL,
    ttl: parseInt(process.env.REDIS_TTL),
  }),
);

export class RedisConfigEnvironmentVariables {
  @IsDefined()
  @IsString()
  REDIS_HOST: string;

  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  REDIS_PORT: number;

  @IsDefined()
  @IsString()
  REDIS_URL: string;

  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  REDIS_TTL: number;
}
