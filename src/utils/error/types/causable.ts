export interface Causable<E extends Error = Error> {
  cause: E
}
