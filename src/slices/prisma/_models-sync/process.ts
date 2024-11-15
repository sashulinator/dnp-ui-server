//            ↓
import { type Process as PrismaType } from '@prisma/client'

//            ↓
import { type BaseProcess as DtoType } from '~/slices/process/models'

import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
