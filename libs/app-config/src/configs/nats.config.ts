import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString } from 'class-validator';
import { NATS_CONFIG_KEY } from '../constant/config.constant';

export type NatsConfig = {
  host: string;
  port: number;
  url: string;
};

export const registerNatsConfig = registerAs(
  NATS_CONFIG_KEY,
  (): NatsConfig => ({
    host: process.env.NATS_HOST,
    port: parseInt(process.env.NATS_PORT),
    url: process.env.NATS_URL,
  }),
);

export class NatsConfigEnvironmentVariables {
  @IsDefined()
  @IsString()
  NATS_HOST: string;

  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  NATS_PORT: number;

  @IsDefined()
  @IsString()
  NATS_URL: string;
}
