/**
 * @hidden
 */
type Setter<T> = (val: T) => T

export type ValueOrSetter<T> = Setter<T> | T
