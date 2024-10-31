import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsNumber, IsString } from 'class-validator';
import { DATABASE_CONFIG_KEY } from '../constant/config.constant';

export enum DatabaseProvider {
  MYSQL = 'mysql',
  MARIA_DB = 'mariadb',
  POSTGRES = 'postgres',
  SQLITE = 'sqlite',
  MONGO_DB = 'mongodb',
}

export type DatabaseConfig = {
  provider: DatabaseProvider;
  host: string;
  port: number;
  username: string;
  password: string;
  synchronize: boolean;
  userDatabaseName: string;
  productDatabaseName: string;
  orderDatabaseName: string;
};

export const registerDatabaseConfig = registerAs(
  DATABASE_CONFIG_KEY,
  (): DatabaseConfig => ({
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
  }),
);

export class DatabaseConfigEnvironmentVariables {
  @IsDefined()
  @IsString()
  DB_PROVIDER: string;

  @IsDefined()
  @IsString()
  DB_HOST: string;

  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  DB_PORT: number;

  @IsDefined()
  @IsString()
  DB_USERNAME: string;

  @IsDefined()
  @IsString()
  DB_PASSWORD: string;

  @Type(() => Boolean)
  @IsDefined()
  @IsBoolean()
  DB_SYNCHRONIZE: boolean;

  @IsDefined()
  @IsString()
  DB_USER_SERVICE_NAME: string;

  @IsDefined()
  @IsString()
  DB_PRODUCT_SERVICE_NAME: string;

  @IsDefined()
  @IsString()
  DB_ORDER_SERVICE_NAME: string;
}
