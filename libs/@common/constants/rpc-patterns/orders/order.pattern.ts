import { IRpcMessagePattern } from '@contracts/rpc/patterns/rpc-message-pattern.interface';

export const ORDERS_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'ORDERS_MESSAGE_PATTERN',
};

export const ORDER_BY_ID_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'ORDER_BY_ID_MESSAGE_PATTERN',
};

export const CREATE_ORDER_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'CREATE_ORDER_MESSAGE_PATTERN',
};
