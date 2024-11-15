//            ↓
import { type NormalizationConfig as PrismaType } from '@prisma/client'

//            ↓
import { type BaseNormalizationConfig as DtoType } from '~/entities/normalization-configs/dto'

import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
