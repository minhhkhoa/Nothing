import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';

@Catch(ZodValidationException)
export class ZodFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Ép kiểu unknown -> ZodError
    const zodError = exception.getZodError() as ZodError;

    const errors = zodError.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    response.status(400).json({
      statusCode: 400,
      message: 'Dữ liệu không hợp lệ',
      errors,
    });
  }
}
