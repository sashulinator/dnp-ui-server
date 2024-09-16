export type Comparison<T extends string | number> =
  | {
      equals?: T
    }
  | {
      lt?: T
    }
  | {
      lte?: T
    }
  | {
      gt?: T
    }
  | {
      gte?: T
    }
