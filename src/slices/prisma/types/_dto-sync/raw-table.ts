//            ↓
import { type RawTable as PrismaType } from '@prisma/client'

//            ↓
import { type BaseRawTable as DtoType } from '~/entities/raw-table/models'

import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
