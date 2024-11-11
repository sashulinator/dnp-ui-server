//            ↓
import { type BussinessTable as PrismaType } from '@prisma/client'

//            ↓
import { type BaseBussinessTable as DtoType } from '~/entities/bussiness-table/models'

import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
