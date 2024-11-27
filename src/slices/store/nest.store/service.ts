import { Injectable } from '@nestjs/common'

import { _CrudService } from './service._crud'

export type * from './service._crud'

@Injectable()
export class StoreService extends _CrudService {}
