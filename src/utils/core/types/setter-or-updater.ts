import { ValueOrSetter } from './value-or-setter'

export type SetterOrUpdater<T> = (valueOrSetter: ValueOrSetter<T>) => void
