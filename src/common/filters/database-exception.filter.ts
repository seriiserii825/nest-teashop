// src/common/filters/database-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError) // Catches TypeORM database errors
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Database Error';

    // PostgreSQL Foreign Key Constraint
    if (exception.code === '23503') {
      status = HttpStatus.BAD_REQUEST;
      message =
        'Cannot delete record due to existing references in related tables';
      error = 'Foreign Key Constraint Violation';
    }

    // PostgreSQL Unique Constraint
    else if (exception.code === '23505') {
      status = HttpStatus.CONFLICT;
      message = 'Record with this value already exists';
      error = 'Unique Constraint Violation';

      // Extract field name from error detail
      const detail = exception.detail || '';
      const match = detail.match(/Key \((.*?)\)=/);
      if (match) {
        message = `${match[1]} already exists`;
      }
    }

    // PostgreSQL Not Null Constraint
    else if (exception.code === '23502') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Required field is missing';
      error = 'Not Null Constraint Violation';
    }

    // MySQL Foreign Key Constraint
    else if (
      exception.code === 'ER_ROW_IS_REFERENCED_2' ||
      exception.errno === 1451
    ) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Cannot delete record due to existing references';
      error = 'Foreign Key Constraint Violation';
    }

    // MySQL Duplicate Entry
    else if (exception.code === 'ER_DUP_ENTRY' || exception.errno === 1062) {
      status = HttpStatus.CONFLICT;
      message = 'Record with this value already exists';
      error = 'Duplicate Entry';
    }

    // SQLite Foreign Key Constraint
    else if (exception.message?.includes('FOREIGN KEY constraint failed')) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Cannot delete record due to existing references';
      error = 'Foreign Key Constraint Violation';
    }

    // Log error for debugging
    console.error('Database Error:', {
      code: exception.code,
      errno: exception.errno,
      message: exception.message,
      detail: exception.detail,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    });
  }
}
