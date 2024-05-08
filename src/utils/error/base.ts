export class BaseError<P extends Record<string, unknown>> extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, props?: P) {
    super(message)

    if (props) {
      Object.assign(this, props)
    }

    Object.setPrototypeOf(this, BaseError.prototype)
  }
}
