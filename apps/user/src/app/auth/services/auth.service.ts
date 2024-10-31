import { AppConfigService } from '@configs/app-config';
import { IUser } from '@contracts/entities/user/user.interface';
import { IJwtPayload } from '@contracts/jwt/jwt-payload.interface';
import { IAuthJwtRpcReply } from '@contracts/rpc/replies/user/auth-jwt.rpc-reply.interface';
import { RpcConflictException } from '@infrastructures/exceptions/rpc-conflict.exception';
import { RpcNotFoundException } from '@infrastructures/exceptions/rpc-not-found.exception';
import { RpcUnauthorizedException } from '@infrastructures/exceptions/rpc-unauthorized.exception';
import { RpcUnprocessableEntityException } from '@infrastructures/exceptions/rpc-unprocessable-entity.exception';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import { ImageGeneratorQueueService } from '../../../modules/queue/services/image-generator-queue.service';
import { AuthAccessRpcRequest } from '../dto/requests/auth-access.rpc-request';
import { AuthSignInRpcRequest } from '../dto/requests/auth-sign-in.rpc-request';
import { AuthSignUpRpcRequest } from '../dto/requests/auth-sign-up.rpc-request';
import { AccountRepository } from '../repositories/account.repository';
import { ProfileRepository } from '../repositories/profile.repository';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly config: AppConfigService,
    private readonly jwtService: JwtService,
    private readonly imageGeneratorQueueService: ImageGeneratorQueueService,
    private readonly accountRepository: AccountRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly userRepository: UserRepository,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async basicSignIn(reqData: AuthSignInRpcRequest): Promise<IAuthJwtRpcReply> {
    const result = await this.accountRepository.findOneByEmail(reqData.email);

    if (!result) {
      throw new RpcNotFoundException('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(
      reqData.password,
      result.password,
    );

    if (!isPasswordMatch) {
      throw new RpcUnauthorizedException('Password not match');
    }

    const payload: IJwtPayload = {
      sub: result.user.id,
      email: result.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }

  async signUp(reqData: AuthSignUpRpcRequest): Promise<IAuthJwtRpcReply> {
    if (await this.accountRepository.findOneByEmail(reqData.email)) {
      throw new RpcConflictException('User already exists');
    }

    if (reqData.password !== reqData.confirmPassword) {
      throw new RpcUnauthorizedException('Password not match');
    }

    const hashedPassword = await bcrypt.hash(
      reqData.password,
      this.config.bcryptConfig.saltRounds,
    );

    const account = await this.accountRepository
      .createAccount({
        email: reqData.email,
        password: hashedPassword,
      })
      .catch((error) => {
        throw new RpcUnprocessableEntityException(error.message);
      });

    const profile = await this.profileRepository
      .createProfile({
        name: reqData.name,
        address: reqData.address,
        phoneNumber: reqData.phoneNumber,
        bio: reqData.bio,
      })
      .catch((error) => {
        throw new RpcUnprocessableEntityException(error.message);
      });

    const user = await this.userRepository
      .createUser({
        account,
        profile,
      })
      .catch((error) => {
        throw new RpcUnprocessableEntityException(error.message);
      });

    this.imageGeneratorQueueService
      .generateAvatar({
        seed: reqData.name,
        key: user.id,
      })
      .then(async (result) => {
        await this.profileRepository.updateImage(
          user.profile.id,
          `${this.config.appConfig.url}/public/user/${path.basename(result.path)}`,
        );
      });

    const payload: IJwtPayload = {
      sub: user.id,
      email: account.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }

  async validateAccess(reqData: AuthAccessRpcRequest): Promise<IUser> {
    const cachedUser: IUser = await this.cacheManager.get(
      `access:${reqData.accessToken}`,
    );

    if (cachedUser) {
      return cachedUser;
    }

    const payload: IJwtPayload = this.jwtService.verify(reqData.accessToken);

    const result = await this.userRepository.findOneByIdAndEmail(
      payload.sub,
      payload.email,
    );

    if (!result) {
      throw new RpcUnauthorizedException('User not found');
    }

    await this.cacheManager.set(`access:${reqData.accessToken}`, result);

    return result;
  }
}
