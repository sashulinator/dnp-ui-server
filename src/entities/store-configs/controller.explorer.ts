import { Body, Controller as NestJSController, Param, Search } from '@nestjs/common'

import Service from './service.explorer'
import { type Explorer } from '../explorer/dto'

@NestJSController('api/v1/store-configs')
export default class StoreConfigExplorerController {
  constructor(private readonly service: Service) {}

  /**
   * ------------ EXPLORE ------------
   *
   * Explore data in a store
   *
   * @param {number} params.skip The number of results to skip
   */
  @Search(':kn/explorer')
  async explore(
    @Body()
    params: { tableName?: string } = {},
    @Param('kn') kn: string
  ): Promise<Explorer> {
    return this.service.explore({
      kn,
      tableName: params.tableName,
    })
  }
}
