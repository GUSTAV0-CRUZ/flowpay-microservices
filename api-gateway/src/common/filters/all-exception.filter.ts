import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest<Request>();
    const res = host.switchToHttp().getResponse<Response>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const message: string = exception?.response?.message || [
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        exception?.message,
      ] || ['Internal server error'];

    let status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.BAD_REQUEST;

    if (String(message).toLocaleLowerCase().includes('not found')) {
      status = HttpStatus.NOT_FOUND;
    }

    res.status(status).json({
      method: req.method,
      path: req.path,
      status,
      message,
    });
  }
}
