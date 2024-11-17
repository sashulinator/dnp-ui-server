import { Controller as NestJSController, Post } from '@nestjs/common'

import { AnalyticsService, type RunParams } from './service'

@NestJSController('api/v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('run')
  run(body: { data: RunParams }) {
    body
  }
}
