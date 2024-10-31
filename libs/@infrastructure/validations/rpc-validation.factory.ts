import { ValidationError } from 'class-validator';
import { RpcValidationException } from '../exceptions/rpc-validation.exception';

export function rpcValidationExceptionFactory(errors: ValidationError[]): void {
  const getMessages = (errs: ValidationError[]): string[] => {
    const messages: string[] = [];

    errs.forEach((error) => {
      if (error.constraints) {
        // Add all constraint messages from the current error level
        messages.push(...Object.values(error.constraints));
      }

      if (error.children && error.children.length > 0) {
        // Recursively handle nested validation errors
        messages.push(...getMessages(error.children));
      }
    });

    return messages;
  };

  const message = getMessages(errors).join('; ');
  throw new RpcValidationException(message);
}
