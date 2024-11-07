import { HttpException as NestHttpException } from '@nestjs/common'

export class HttpException extends NestHttpException {
  /**
   * Сообщение для отображения в ui
   */
  private readonly translated: string
  /**
   * Объяснение или Инструкция по устранению ошибки для отображения в ui
   */
  private readonly description: string

  constructor(
    response: { message: string; translated: string; description: string } & Record<string, unknown>,
    status: number,
  ) {
    super(response, status)
    this.translated = response.translated
    this.description = response.description
    Object.setPrototypeOf(this, NestHttpException.prototype)
  }

  getTranslated() {
    return this.translated
  }

  getDescription() {
    return this.description
  }
}
