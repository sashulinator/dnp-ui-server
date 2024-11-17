import { Controller as NestJSController, Post } from '@nestjs/common'

import type { AnalyticalActions } from './nest.service'
import { AnaliticalActionsService } from './nest.service'

@NestJSController('api/v1/analytical-actions')
export class AnaliticalActionsController {
  constructor(private readonly analiticalActionsService: AnaliticalActionsService) {}

  @Post('/find-many')
  findMany(): Promise<AnalyticalActions[]> {
    return this.analiticalActionsService.findMany()
  }
}
