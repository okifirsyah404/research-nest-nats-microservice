import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const GetAccessToken = createParamDecorator(
  (data, ctx: ExecutionContext): string => {
    const accessToken: string = ctx.switchToHttp().getRequest().accessToken;

    return accessToken;
  },
);

export default GetAccessToken;
