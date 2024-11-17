//            ↓
import { type DcDatabase as PrismaType } from '@prisma/client'

//            ↓
import { type BaseDatabase as DtoType } from '~/entities/database-container/models'

import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
