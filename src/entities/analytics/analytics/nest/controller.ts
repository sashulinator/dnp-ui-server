import { Body, Controller as NestJSController, Post } from '@nestjs/common'

import { AnalyticsService, type FindManyAndCountTablesParams, type RunParams } from './service'

@NestJSController('api/v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('run')
  run(@Body() body: { data: RunParams }) {
    return this.analyticsService.run(body.data)
  }

  @Post('find-many-and-count-tables')
  findManyAndCountTables(@Body() body: { data: FindManyAndCountTablesParams }) {
    return this.analyticsService.findManyAndCountTables(body.data)
  }
}
