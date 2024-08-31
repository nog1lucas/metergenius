import { ExceptionFilter, Catch, ArgumentsHost, ConflictException } from '@nestjs/common';
import { Response } from 'express';

@Catch(ConflictException)
export class ConfirmationDuplicateFilter implements ExceptionFilter {
  catch(exception: ConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    const errorDescription = typeof exceptionResponse === 'string'
      ? exceptionResponse
      : (exceptionResponse as any).message

    response
      .status(status)
      .json({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: errorDescription,
      });
  }
}
