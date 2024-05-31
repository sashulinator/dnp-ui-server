import { BadRequestException, type PipeTransform } from '@nestjs/common'

import * as v from 'valibot'

export class ValibotPipe implements PipeTransform {
  constructor(private schema: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>) {}

  transform(value: unknown /* metadata: ArgumentMetadata */) {
    try {
      return v.parse(this.schema, value)
    } catch (error) {
      throw new BadRequestException({ errors: error.issues }, 'Validation failed')
    }
  }
}
