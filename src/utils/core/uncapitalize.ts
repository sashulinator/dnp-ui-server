export function uncapitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toLowerCase() + str.slice(1)) as Capitalize<T>
}
