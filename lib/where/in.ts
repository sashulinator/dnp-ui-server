export type In<T extends string | number> =
  | {
      in?: T[]
    }
  | {
      notIn?: T[]
    }
