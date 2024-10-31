/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AccessTokenGuard.name);

  constructor(options?: IAuthModuleOptions) {
    super({
      ...options,
      property: 'accessToken',
    });
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): any {
    if (err || !user) {
      this.logger.error(`Error: ${err}`);
      this.logger.error(`Info: ${info}`);

      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      } else if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token invalid');
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
    return user;
  }
}
