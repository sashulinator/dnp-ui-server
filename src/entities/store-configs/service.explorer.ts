import { Injectable } from '@nestjs/common'
import ExplorerService from '../explorer/service'
import StoreConfigService from './service'
import { assertJDBCData } from '~/common/store-config'
import { type Explorer } from '../explorer/dto'

@Injectable()
export default class StoreConfigExplorerService {
  constructor(
    private storeConfigService: StoreConfigService,
    private explorerService: ExplorerService
  ) {}

  /**
   * ------------ EXPLORE ------------
   *
   * Explore data in a store
   */
  async explore(params: { kn: string; tableName?: string | undefined }): Promise<Explorer> {
    const { data } = await this.storeConfigService.findUnique({
      kn: params.kn,
    })

    assertJDBCData(data)

    if (params.tableName) {
      return this.explorerService.getJdbcTable(data, params.tableName)
    }

    return this.explorerService.getJdbcDatabase(data)
  }
}
