import { Module } from '@nestjs/common';
import { AccessTokenStrategy } from '../../infrastructures/strategies/access-token.strategy';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy],
})
export class AuthModule {}
