//            ↓
import { type DictionaryTable as PrismaType } from '@prisma/client'

//            ↓
import { type BaseDictionaryTable as DtoType } from '~/entities/dictionary-table/models.dictionary-table'

import { type DateToString, check } from './_private'

check<DtoType, PrismaType>({} as DtoType, {} as DateToString<PrismaType>)
