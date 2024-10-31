import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig, Environment } from '../configs/app.config';
import { BcryptConfig } from '../configs/bcrypt.config';
import { DatabaseConfig, DatabaseProvider } from '../configs/database.config';
import { JwtConfig } from '../configs/jwt.config';
import { NatsConfig } from '../configs/nats.config';
import { RedisConfig } from '../configs/redis.config';
import {
  APP_CONFIG_KEY,
  BCRYPT_CONFIG_KEY,
  DATABASE_CONFIG_KEY,
  JWT_CONFIG_KEY,
  NATS_CONFIG_KEY,
  REDIS_CONFIG_KEY,
} from '../constant/config.constant';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get appConfig(): AppConfig {
    return this.configService.get<AppConfig>(APP_CONFIG_KEY);
  }

  static async getAppConfig(): Promise<AppConfig> {
    await ConfigModule.envVariablesLoaded;

    return {
      env:
        process.env.NODE_ENV !== undefined
          ? Environment[process.env.NODE_ENV.toUpperCase()]
          : Environment.DEV,
      host: process.env.APP_API_HOST,
      port: parseInt(process.env.APP_API_PORT),
      url: process.env.APP_API_URL,
    };
  }

  get natsConfig(): NatsConfig {
    return this.configService.get<NatsConfig>(NATS_CONFIG_KEY);
  }

  static async getNatsConfig(): Promise<NatsConfig> {
    await ConfigModule.envVariablesLoaded;

    return {
      host: process.env.NATS_HOST,
      port: parseInt(process.env.NATS_PORT),
      url: process.env.NATS_URL,
    };
  }

  get databaseConfig(): DatabaseConfig {
    return this.configService.get<DatabaseConfig>(DATABASE_CONFIG_KEY);
  }

  static async getDatabaseConfig(): Promise<DatabaseConfig> {
    await ConfigModule.envVariablesLoaded;

    return {
      provider:
        process.env.DB_PROVIDER !== undefined
          ? DatabaseProvider[process.env.DB_PROVIDER.toUpperCase()]
          : DatabaseProvider.POSTGRES,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      userDatabaseName: process.env.DB_USER_SERVICE_NAME,
      productDatabaseName: process.env.DB_PRODUCT_SERVICE_NAME,
      orderDatabaseName: process.env.DB_ORDER_SERVICE_NAME,
    };
  }

  get jwtConfig(): JwtConfig {
    return this.configService.get<JwtConfig>(JWT_CONFIG_KEY);
  }

  static async getJwtConfig(): Promise<JwtConfig> {
    await ConfigModule.envVariablesLoaded;

    return {
      accessSecret: process.env.JWT_SECRET,
      accessExpiresIn: process.env.JWT_EXPIRES_IN,
    };
  }

  get bcryptConfig(): BcryptConfig {
    return this.configService.get<BcryptConfig>(BCRYPT_CONFIG_KEY);
  }

  static async getBcryptConfig(): Promise<BcryptConfig> {
    await ConfigModule.envVariablesLoaded;

    return {
      saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS),
    };
  }

  get redisConfig(): RedisConfig {
    return this.configService.get<RedisConfig>(REDIS_CONFIG_KEY);
  }

  static async getRedisConfig(): Promise<RedisConfig> {
    await ConfigModule.envVariablesLoaded;

    return {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      url: process.env.REDIS_URL,
      ttl: parseInt(process.env.REDIS_TTL),
    };
  }
}
