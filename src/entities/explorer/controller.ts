import { Body, Controller as NestJSController, Search } from '@nestjs/common'
import Service, { type ExploreParams } from './service'
import { type Explorer } from './dto'

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
    params: ExploreParams
  ): Promise<Explorer> {
    return this.service.expore(params)
  }
}
