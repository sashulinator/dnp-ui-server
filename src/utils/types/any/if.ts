import type { Boolean } from '../boolean/_internal'

export type If<B extends Boolean, Then, Else = never> = B extends 1 ? Then : Else
