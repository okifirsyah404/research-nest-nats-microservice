import { IRpcMessagePattern } from '@contracts/rpc/patterns/rpc-message-pattern.interface';

export const PRODUCT_CATEGORIES_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'PRODUCT_CATEGORIES_MESSAGE_PATTERN',
};

export const PRODUCT_BY_CATEGORY_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'PRODUCT_BY_CATEGORY_MESSAGE_PATTERN',
};

export const PRODUCTS_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'PRODUCTS_MESSAGE_PATTERN',
};

export const PRODUCT_BY_ID_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'PRODUCT_BY_ID_MESSAGE_PATTERN',
};

export const PRODUCTS_BY_IDS_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'PRODUCTS_BY_IDS_MESSAGE_PATTERN',
};

export const PRODUCT_QTY_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'PRODUCT_QTY_MESSAGE_PATTERN',
};

export const DECREASE_PRODUCT_QTY_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'DECREASE_PRODUCT_QTY_MESSAGE_PATTERN',
};

export const DECREASE_PRODUCTS_QTY_MESSAGE_PATTERN: IRpcMessagePattern = {
  cmd: 'DECREASE_PRODUCTS_QTY_MESSAGE_PATTERN',
};
