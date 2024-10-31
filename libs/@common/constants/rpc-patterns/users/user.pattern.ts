import { IRpcMessagePattern } from '@contracts/rpc/patterns/rpc-message-pattern.interface';

export const USER_AUTH_SIGN_IN_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'USER_AUTH_SIGN_IN_MESSAGE_PATTERN',
};

export const USER_AUTH_SIGN_UP_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'USER_AUTH_SIGN_UP_MESSAGE_PATTERN',
};

export const USER_AUTH_ACCESS_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'USER_AUTH_ACCESS_MESSAGE_PATTERN',
};

export const USER_GET_PROFILE_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'USER_GET_PROFILE_MESSAGE_PATTERN',
};

export const USER_UPDATE_PROFILE_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'USER_UPDATE_PROFILE_MESSAGE_PATTERN',
};
