import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { registerAppConfig } from './configs/app.config';
import { registerBcryptConfig } from './configs/bcrypt.config';
import { registerDatabaseConfig } from './configs/database.config';
import { registerJwtConfig } from './configs/jwt.config';
import { registerNatsConfig } from './configs/nats.config';
import { registerRedisConfig } from './configs/redis.config';
import { AppConfigService } from './providers/app-config.service';
import { validateConfig } from './validation/config.validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        '.env.local',
        '.env.development',
        '.env.staging',
        '.env.production',
        '.env',
      ],
      isGlobal: true,
      expandVariables: true,
      load: [
        registerAppConfig,
        registerNatsConfig,
        registerDatabaseConfig,
        registerJwtConfig,
        registerBcryptConfig,
        registerRedisConfig,
      ],
      validate: validateConfig,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
