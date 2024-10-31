import { IUser } from '@contracts/entities/user/user.interface';
import { RpcNotFoundException } from '@infrastructures/exceptions/rpc-not-found.exception';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AuthService } from '../../auth/services/auth.service';
import { GetProfileRpcRequest } from '../dto/requests/get-profile.rpc-request';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  private readonly logger = new Logger(ProfileService.name);

  async getProfile(reqData: GetProfileRpcRequest): Promise<IUser> {
    const accessUser = await this.authService.validateAccess(reqData);

    const cachedUser: IUser = await this.cacheManager.get(
      `user:${accessUser.id}`,
    );

    if (cachedUser) {
      return cachedUser;
    }

    const result = await this.userRepository.findById(accessUser.id);

    if (!result) {
      throw new RpcNotFoundException('User not found');
    }

    this.cacheManager.set(`user:${accessUser.id}`, result);

    return result;
  }
}
