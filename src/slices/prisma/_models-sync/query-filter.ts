//            ↓
import { type QueryFilter as PrismaType } from '@prisma/client'

//            ↓
import { type QueryFilter as DtoType } from '~/slices/query-filter/models'

import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
