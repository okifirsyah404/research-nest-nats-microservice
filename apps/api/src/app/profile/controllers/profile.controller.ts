import { IApiResponse } from '@contracts/api/api-response.interface';
import { BaseApiResponse } from '@infrastructures/responses/base-api.response';
import { Controller, Get, UseGuards } from '@nestjs/common';
import GetAccessToken from 'apps/api/src/infrastructures/decorators/get-access-token.decorator';
import { AccessTokenGuard } from 'apps/api/src/infrastructures/guards/access-token.guard';
import { GetProfileResponse } from '../dto/responses/get-profile.response';
import { ProfileService } from '../services/profile.service';

@UseGuards(AccessTokenGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(
    @GetAccessToken() accessToken: string,
  ): Promise<IApiResponse<GetProfileResponse>> {
    const result = await this.profileService.fetchProfile(accessToken);

    return BaseApiResponse.ok({
      message: 'User profile fetched successfully',
      data: GetProfileResponse.fromEntity(result),
    });
  }
}
