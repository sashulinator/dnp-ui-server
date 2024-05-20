/**
 * Counter for unique id.
 * @type {Number}
 * @private
 */
let uniqueIdCounter_: number = 1

/**
 * Unique id property prefix.
 * @type {String}
 * @protected
 */
export const UID_PROPERTY: string = `core_${(Math.random() * 1e9) >>> 0}`

/**
 * Gets an unique id. If `object` argument is passed, the object is
 * mutated with an unique id. Consecutive calls with the same object
 * reference won't mutate the object again, instead the current object uid
 * returns. See {@link UID_PROPERTY}.
 * @param {Object=} object Optional object to be mutated with the uid. If
 *     not specified this method only returns the uid.
 * @param {boolean=} noInheritance Optional flag indicating if this
 *     object's uid property can be inherited from parents or not.
 * @throws {Error} when invoked to indicate the method should be overridden.
 *
 * @return {number}
 * https://github.com/metal/metal.js/blob/master/packages/metal/src/coreNamed.js
 */
export function getUid(object?: object | undefined, noInheritance?: boolean | undefined): number {
  if (object) {
    let id = object[UID_PROPERTY]
    if (noInheritance && !object.hasOwnProperty(UID_PROPERTY)) {
      id = null
    }
    return id || (object[UID_PROPERTY] = uniqueIdCounter_++)
  }
  return uniqueIdCounter_++
}
