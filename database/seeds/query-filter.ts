import { type Prisma } from '@prisma/client'

import { targetDatabase } from './database-containers/database'
import { currentAppService } from './database-containers/service'

export const onlyRepublicsQueryFilter: Prisma.QueryFilterCreateInput = {
  name: 'Только Республики',
  // TODO проставить полный путь
  track: `${currentAppService.id}:${targetDatabase.name}:public:rfSubjects`,
  data: {
    where: { name: { startsWith: 'Республика' } },
    sort: { region_code: 'asc' },
    searchQuery: { startsWith: null },
  },
}

export const onlyOblastQueryFilter: Prisma.QueryFilterCreateInput = {
  name: 'Только Республики',
  // TODO проставить полный путь
  track: `${currentAppService.id}:${targetDatabase.name}:public:rfSubjects`,
  data: {
    where: { name: { endsWith: 'область' } },
    sort: { region_code: 'asc' },
    searchQuery: { startsWith: null },
  },
}

export default [onlyRepublicsQueryFilter, onlyOblastQueryFilter]
