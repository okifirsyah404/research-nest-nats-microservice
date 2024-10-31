import { USER_GET_PROFILE_MESSAGE_PATTERN } from '@commons/constants/rpc-patterns/users/user.pattern';
import { IRpcReply } from '@contracts/rpc/replies/base.rpc-reply.interface';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetProfileRpcReply } from '../dto/replies/get-profile.rpc-reply';
import { GetProfileRpcRequest } from '../dto/requests/get-profile.rpc-request';
import { ProfileService } from '../services/profile.service';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern(USER_GET_PROFILE_MESSAGE_PATTERN)
  async getProfile(
    @Payload() reqData: GetProfileRpcRequest,
  ): Promise<IRpcReply<GetProfileRpcReply>> {
    const result = await this.profileService.getProfile(reqData);

    return {
      message: 'User profile fetched successfully',
      data: GetProfileRpcReply.fromEntity(result),
    };
  }
}
