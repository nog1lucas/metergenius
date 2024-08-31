import { ExceptionFilter, Catch, ArgumentsHost, ConflictException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class MeasureNotFoundFilter implements ExceptionFilter {
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
        error_code: 'MEASURE_NOT_FOUND',
        error_description: errorDescription,
      });
  }
}
