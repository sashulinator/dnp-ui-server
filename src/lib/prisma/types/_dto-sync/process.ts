//            ↓
import { type Process as PrismaType } from '@prisma/client'
//            ↓
import { type BaseProcess as DtoType } from '~/entities/processes/dto'
import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
