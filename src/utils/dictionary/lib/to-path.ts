// https://github.com/final-form/final-form/blob/main/src/structure/toPath.js

const charCodeOfDot = '.'.charCodeAt(0)
const reEscapeChar = /\\(\\)?/g
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' +
    '|' +
    // Or match property names within brackets.
    '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' +
    '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
    ')\\]' +
    '|' +
    // Or match "" as the space between consecutive dots or empty brackets.
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
  'g',
)

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
// @ts-ignore
function stringToPath(string) {
  const result: string[] = []
  if (string.charCodeAt(0) === charCodeOfDot) {
    result.push('')
  }
  // @ts-ignore
  string.replace(rePropName, (match, expression, quote, subString) => {
    let key = match
    if (quote) {
      key = subString.replace(reEscapeChar, '$1')
    } else if (expression) {
      key = expression.trim()
    }
    result.push(key)
  })
  return result
}

const keysCache: Record<string, string[]> = {}
const keysRegex = /[.[\]]+/

export function toPath(key: string): string[] {
  if (key === null || key === undefined || !key.length) {
    return []
  }
  if (typeof key !== 'string') {
    throw new Error('toPath() expects a string')
  }
  if (keysCache[key] == null) {
    /**
     * The following patch fixes issue 456, introduced since v4.20.3:
     *
     * Before v4.20.3, i.e. in v4.20.2, a `key` like 'choices[]' would map to ['choices']
     * (e.g. an array of choices used where 'choices[]' is name attribute of an input of type checkbox).
     *
     * Since v4.20.3, a `key` like 'choices[]' would map to ['choices', ''] which is wrong and breaks
     * this kind of inputs e.g. in React.
     *
     * v4.20.3 introduced an unwanted breaking change, this patch fixes it, see the issue at the link below.
     *
     * @see https://github.com/final-form/final-form/issues/456
     */
    if (key.endsWith('[]')) {
      // v4.20.2 (a `key` like 'choices[]' should map to ['choices'], which is fine).
      keysCache[key] = key.split(keysRegex).filter(Boolean)
    } else {
      // v4.20.3 (a `key` like 'choices[]' maps to ['choices', ''], which breaks applications relying on inputs like `<input type="checkbox" name="choices[]" />`).
      keysCache[key] = stringToPath(key)
    }
  }
  return keysCache[key]
}
