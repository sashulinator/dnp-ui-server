function toVal(mix) {
  let str = ''

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix
  }

  return str
}

export function c(...args: unknown[]) {
  let i = 0,
    tmp,
    x,
    str = ''
  while (i < args.length) {
    if ((tmp = args[i++])) {
      if ((x = toVal(tmp))) {
        str && (str += ' ')
        str += x
      }
    }
  }
  return str
}
