import { AppConfigService } from '@configs/app-config';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtConfig.accessSecret,
      passReqToCallback: true,
    });
  }

  private readonly logger = new Logger(AccessTokenStrategy.name);

  validate(req: Request): string {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    return token;
  }
}
