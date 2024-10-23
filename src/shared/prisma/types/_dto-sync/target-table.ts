//            ↓
import { type TargetTable as PrismaType } from '@prisma/client'

//            ↓
import { type BaseTargetTable as DtoType } from '~/entities/target-table/dto'

import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
