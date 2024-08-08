//            ↓
import { type OperationalTable as PrismaType } from '@prisma/client'
//            ↓
import { type BaseOperationalTable as DtoType } from '~/entities/operational-table/dto'
import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
