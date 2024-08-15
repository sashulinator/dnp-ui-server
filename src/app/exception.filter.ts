import {
  type ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  type ExceptionFilter as NestJSExceptionFilter,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

import { has, isInstanceOf } from '../utils/core'
import { assertError, isCausable } from '../utils/error'
import { Prisma } from '@prisma/client'

export type ErrorBody = {
  message: string
  status: number
  timestamp: string
  path: string
  cause?: Error
  stack: string[]
  errors?: unknown
}

/**
 * @final
 */
@Catch()
export default class ExceptionFilter implements NestJSExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost
    assertError(exception)

    const ctx = host.switchToHttp()

    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const responseBody: ErrorBody = {
      status: httpStatus,
      message: exception.message,
      stack: exception.message.split('\n'),
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    }

    if (isCausable(exception)) {
      responseBody.cause = exception.cause
    }
    if (has(exception, 'errors')) {
      responseBody.errors = exception.errors
    }
    if (has(exception, 'response') && has(exception.response, 'errors')) {
      responseBody.errors = exception.response.errors
    }

    if (isInstanceOf(exception, Prisma.PrismaClientKnownRequestError) && exception.code === 'P2002') {
      responseBody.status = HttpStatus.CONFLICT
      const parts = exception.message.split('\n')
      responseBody.message = parts[parts.length - 1]
    }

    if (isInstanceOf(exception, Prisma.PrismaClientKnownRequestError) && exception.code === 'P2025') {
      responseBody.status = HttpStatus.NOT_FOUND
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.status)
  }
}
