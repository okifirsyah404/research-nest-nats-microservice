import * as dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

expand(dotenv.config());

enum DatabaseProvider {
  MYSQL = 'mysql',
  MARIA_DB = 'mariadb',
  POSTGRES = 'postgres',
  SQLITE = 'sqlite',
  MONGO_DB = 'mongodb',
}

export const dataSourceConfig: DataSourceOptions & SeederOptions = {
  type:
    process.env.DB_PROVIDER !== undefined
      ? DatabaseProvider[process.env.DB_PROVIDER.toUpperCase()]
      : DatabaseProvider.POSTGRES,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_USER_SERVICE_NAME || 'user',
  entities: [join(__dirname, '..', 'entities', '*{.ts,.js}')],
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  migrationsTableName: '__migrations',
  seeds: [`./apps/user/src/database/seeders/*{.ts,.js}`],
  factories: [`./apps/user/src/database/factories/*{.ts,.js}`],
  namingStrategy: new SnakeNamingStrategy(),
};

export const dataSource = new DataSource(dataSourceConfig);
