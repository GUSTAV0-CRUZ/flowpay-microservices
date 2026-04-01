import { Logger } from '@nestjs/common';

export function loggerError(error: any, logger: Logger, methodName: string) {
  return logger.error({
    method: methodName,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    message: error.message,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    stack: error.stack,
  });
}
