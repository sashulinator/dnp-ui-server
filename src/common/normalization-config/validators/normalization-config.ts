import { assertInteger as Integer, assertNotEmpty as NotEmpty, assertString as String } from '~/utils/assertions'
import { and, or } from '~/utils/validator'
import { ToSchema } from '~/utils/validator/types'

import { Executable, NormalizationConfig } from '../types/normalization-config'

export const executable: ToSchema<Executable> = {
  'computable-config': {
    'computable-name': and(NotEmpty, String),
    version: and(NotEmpty, String),
  },
  'sdk-config': {
    'sdk-name': and(NotEmpty, String),
    version: and(NotEmpty, String),
  },
}

export const normalizationConfigSchema: ToSchema<NormalizationConfig> = {
  id: or(and(NotEmpty, String), Integer),
  name: and(NotEmpty, String),
  createdBy: and(NotEmpty, String),
  updatedBy: and(NotEmpty, String),
  createdAt: and(NotEmpty, String),
  updatedAt: and(NotEmpty, String),
  data: { executables: [executable] },
}
