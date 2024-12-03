import { Controller as NestJSController, Post } from '@nestjs/common'

import type { AnalyticalActions } from './service'
import { ActionService } from './service'

@NestJSController('api/v1/analytical-actions')
export class ActionController {
  constructor(private readonly analyticalActionsService: ActionService) {}

  @Post('/find-many')
  findMany(): Promise<AnalyticalActions[]> {
    return this.analyticalActionsService.findMany()
  }
}
