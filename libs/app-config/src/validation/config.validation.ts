import { IntersectionType } from '@nestjs/mapped-types';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppConfigEnvironmentVariables } from '../configs/app.config';
import { BcryptConfigEnvironmentVariables } from '../configs/bcrypt.config';
import { DatabaseConfigEnvironmentVariables } from '../configs/database.config';
import { JwtConfigEnvironmentVariables } from '../configs/jwt.config';
import { NatsConfigEnvironmentVariables } from '../configs/nats.config';
import { RedisConfigEnvironmentVariables } from '../configs/redis.config';

class EnvironmentVariables extends IntersectionType(
  AppConfigEnvironmentVariables,
  NatsConfigEnvironmentVariables,
  DatabaseConfigEnvironmentVariables,
  JwtConfigEnvironmentVariables,
  BcryptConfigEnvironmentVariables,
  RedisConfigEnvironmentVariables,
) {}

export function validateConfig(
  config: Record<string, unknown>,
): EnvironmentVariables {
  // Convert the plain object to an instance of the EnvironmentVariables class.
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  // Validate the configuration object.
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(`Some Env was missing or didn't match \n ${errors}`);
  }
  return validatedConfig;
}
