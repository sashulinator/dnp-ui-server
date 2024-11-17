//            ↓
import { type DcTable as PrismaType } from '@prisma/client'

//            ↓
import { type BaseTable as DtoType } from '~/entities/database-container/models'

import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
