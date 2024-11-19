/**
 * Checks if two objects are shallowly equal.
 *
 * @param a The first object.
 * @param b The second object.
 * @returns True if the objects are shallowly equal, false otherwise.
 */
export function isShallowEqual(a: any, b: any): boolean {
  // If the objects are strictly equal, they are shallowly equal
  if (a === b) {
    return true
  }

  // If either object is not an object, they are not shallowly equal
  if (typeof a !== 'object' || !a || typeof b !== 'object' || !b) {
    return false
  }

  // If the number of keys in the objects is not equal, they are not shallowly equal
  var keysA = Object.keys(a)
  var keysB = Object.keys(b)
  if (keysA.length !== keysB.length) {
    return false
  }

  // Check if each key in a is also in b and if the values are equal
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(b)
  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx]
    if (!bHasOwnProperty(key) || a[key] !== b[key]) {
      return false
    }
  }

  // If all keys and values are equal, the objects are shallowly equal
  return true
}
