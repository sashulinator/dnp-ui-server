import { type ArgumentsHost, Catch, HttpStatus, type ExceptionFilter as NestJSExceptionFilter } from '@nestjs/common'
import { HttpException as NestHttpException } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Prisma } from '@prisma/client'

import { HttpException } from '~/shared/error'

import { has, isInstanceOf } from '../utils/core'
import { assertError, isCausable } from '../utils/error'

export type BodyError = {
  /**
   * Сообщение для отображения в ui
   */
  message: string
  /**
   * Объяснение или Инструкция по устранению ошибки для отображения в ui
   */
  description: string
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

    const httpStatus = exception instanceof NestHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const translated = exception instanceof HttpException ? exception.getTranslated() : 'Неизвестная ошибка'
    const description = exception instanceof HttpException ? exception.getDescription() : ''

    const responseBody: BodyError = {
      message: translated || 'Неизвестная ошибка',
      description: description,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      status: httpStatus,
      timestamp: new Date().toISOString(),
      stack: exception.message.split('\n'),
      cause: exception,
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
