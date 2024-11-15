//            ↓
import { type User as PrismaType } from '@prisma/client'

//            ↓
import { type BaseUser as DtoType } from '~/entities/user/dto'

import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
