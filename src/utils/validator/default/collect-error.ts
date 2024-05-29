import { Context } from '../types'

export function collectError<EC extends unknown[], EV>(validationError: unknown, ctx: Context<EC, EV>): void {
  ctx.errorCollection.push(validationError)
}
