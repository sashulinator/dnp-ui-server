import { Body, Controller as NestJSController, Search } from '@nestjs/common'
import { type Path } from './dto'
import Service from './service'
import { type Explorer } from './dto'
import type { JdbcData } from '../store-configs/dto'

@NestJSController('api/v1/explorer')
export default class ExplorerController {
  constructor(private readonly service: Service) {}

  /**
   * ------------ EXPLORE ------------
   *
   * Explore data in a store
   *
   * @param {number} params.skip The number of results to skip
   */
  @Search()
  async explore(
    @Body()
    params: {
      paths: Path[]
      storeConfigData: { type: 'jdbc'; data: JdbcData }
    }
  ): Promise<Explorer> {
    return this.service.expore(params)
  }
}
