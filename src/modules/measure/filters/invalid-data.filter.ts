import { ExceptionFilter, Catch, ArgumentsHost, ConflictException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class InvalidDataFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorDescription = typeof exceptionResponse === 'string'
      ? exceptionResponse
      : (exceptionResponse as any).message

    response
      .status(status)
      .json({
        error_code: 'INVALID_DATA',
        error_description: errorDescription,
      });
  }
}
