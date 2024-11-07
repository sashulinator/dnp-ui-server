//            ↓
import { type StoreConfig as PrismaType } from '@prisma/client'

//            ↓
import { type BaseStoreConfig as DtoType } from '~/entities/store-configs/dto'

import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
