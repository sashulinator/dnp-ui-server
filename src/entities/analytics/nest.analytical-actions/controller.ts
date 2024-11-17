import { Controller as NestJSController, Post } from '@nestjs/common'

import type { AnalyticalActions } from './service'
import { AnalyticalActionsService } from './service'

@NestJSController('api/v1/analytical-actions')
export class AnalyticalActionsController {
  constructor(private readonly analyticalActionsService: AnalyticalActionsService) {}

  @Post('/find-many')
  findMany(): Promise<AnalyticalActions[]> {
    return this.analyticalActionsService.findMany()
  }
}
