import { IApiResponse } from '@contracts/api/api-response.interface';
import { BaseApiResponse } from '@infrastructures/responses/base-api.response';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthSignInRequest } from '../dto/requests/auth-sign-in.request';
import { AuthSignUpRequest } from '../dto/requests/auth-sign-up.request';
import { AuthAccessTokenResponse } from '../dto/responses/auth-access-token.response';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async basicSignIn(
    @Body() reqData: AuthSignInRequest,
  ): Promise<IApiResponse<AuthAccessTokenResponse>> {
    const result = await this.authService.basicSigngin(reqData);

    return BaseApiResponse.created({
      message: 'User signed in successfully',
      data: AuthAccessTokenResponse.fromEntity(result),
    });
  }

  @Post('sign-up')
  async signUp(
    @Body() reqData: AuthSignUpRequest,
  ): Promise<IApiResponse<AuthAccessTokenResponse>> {
    const result = await this.authService.signUp(reqData);

    return BaseApiResponse.created({
      message: 'User signed up successfully',
      data: AuthAccessTokenResponse.fromEntity(result),
    });
  }
}
