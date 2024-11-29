//            ↓
import { type DcService as PrismaType } from '@prisma/client'

//            ↓
import { type DcserviceBase as DtoType } from '~/entities/database-container/dcservice/models'

import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
