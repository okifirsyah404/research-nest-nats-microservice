import { registerAs } from '@nestjs/config';
import { IsDefined, IsString } from 'class-validator';
import { JWT_CONFIG_KEY } from '../constant/config.constant';

export type JwtConfig = {
  accessSecret: string;
  accessExpiresIn: string;
};

export const registerJwtConfig = registerAs(
  JWT_CONFIG_KEY,
  (): JwtConfig => ({
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  }),
);

export class JwtConfigEnvironmentVariables {
  @IsDefined()
  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsDefined()
  @IsString()
  JWT_ACCESS_EXPIRES_IN: string;
}
