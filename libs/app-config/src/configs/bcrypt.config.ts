import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsDefined, IsNumber } from 'class-validator';
import { BCRYPT_CONFIG_KEY } from '../constant/config.constant';

export type BcryptConfig = {
  saltRounds: number;
};
export const registerBcryptConfig = registerAs(
  BCRYPT_CONFIG_KEY,
  (): BcryptConfig => ({
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10),
  }),
);

export class BcryptConfigEnvironmentVariables {
  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  BCRYPT_SALT_ROUNDS: number;
}
