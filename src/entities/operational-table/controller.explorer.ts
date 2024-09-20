import { Body, Delete, Controller as NestJSController, Post, Put, Search } from '@nestjs/common'

import Service, {
  type ExplorerCreateParams,
  type ExplorerDeleteParams,
  type ExplorerFindManyParams,
  ExplorerImportParams,
  type ExplorerUpdateParams,
} from './service.explorer'

@NestJSController('api/v1/operational-tables/explorer')
export default class OperationalTableController {
  constructor(private readonly service: Service) {}

  /**
   * ------------ IMPORT ------------
   */
  @Post('import')
  async explorerImport(@Body() body: ExplorerImportParams) {
    return this.service.explorerImport(body)
  }

  /**
   * ------------ CREATE ------------
   */
  @Post()
  explorerCreate(@Body() body: ExplorerCreateParams) {
    return this.service.explorerCreate(body)
  }

  /**
   * ------------ UPDATE ------------
   */
  @Put()
  explorerUpdate(@Body() body: ExplorerUpdateParams) {
    return this.service.explorerUpdate(body)
  }

  /**
   * ------------ DELETE ------------
   */
  @Delete()
  explorerDelete(@Body() body: ExplorerDeleteParams) {
    return this.service.explorerDelete(body)
  }

  /**
   * ------------ FINMANY ------------
   */
  @Search()
  explorerFindManyAndCountRows(@Body() body: ExplorerFindManyParams) {
    return this.service.explorerFindManyAndCountRows(body)
  }
}
