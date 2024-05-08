import {
  ExceptionFilter as NestJSExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { isCausable } from './utils/error'

export type ErrorBody = {
  status: number
  timestamp: string
  path: string
  cause?: Error
}

/**
 * @final
 */
@Catch()
export class ExceptionFilter implements NestJSExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const responseBody: ErrorBody = {
      status: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    }

    if (isCausable(exception)) {
      responseBody.cause = exception.cause
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
