import { Body, Controller as NestJSController, Put, Search } from '@nestjs/common'
import Service, { type FindManyParams, type UpdateParams } from './service'
import { type Explorer } from './dto'

@NestJSController('api/v1/explorer')
export default class ExplorerController {
  constructor(private readonly service: Service) {}

  /**
   * ------------ FETCH MANY ------------
   *
   * Fetch list of tables or rows from a database
   */
  @Search()
  async fetchMany(
    @Body()
    params: FindManyParams
  ): Promise<Explorer> {
    return this.service.findMany(params)
  }

  @Put()
  update(params: UpdateParams) {
    this.service.update(params)
  }
}
