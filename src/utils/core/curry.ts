type MakeTuple<LEN extends number, T extends any = any, C extends T[] = []> = C['length'] extends LEN
  ? C
  : MakeTuple<LEN, T, [T, ...C]>
type CurryOverload<F extends (...args: any[]) => any, N extends unknown[], P extends unknown[]> = N extends [
  infer L,
  ...infer R,
]
  ? ((...args: [...P, L]) => CurryInternal<F, R>) & CurryOverload<F, R, [...P, L]>
  : () => CurryInternal<F, P>
type CurryInternal<F extends (...args: any[]) => any, N extends unknown[]> = 0 extends N['length']
  ? ReturnType<F>
  : CurryOverload<F, N, []>
type Curry<
  F extends (...args: any[]) => any,
  LEN extends number | undefined = undefined,
  I extends any = any,
> = 0 extends (LEN extends undefined ? Parameters<F>['length'] : LEN)
  ? () => ReturnType<F>
  : CurryInternal<F, LEN extends undefined ? Parameters<F> : MakeTuple<LEN extends undefined ? 0 : LEN, I>>

/*
  function add(a, b, c) {
    return a + b + c;
  }
  curry(add)(1)(2)(3); // 6
  curry(add)(1)(2)(2); // 5
  curry(add)(2)(4, 3); // 9

  function add(...args) {
    return args.reduce((sum, n) => sum + n, 0)
  }
  var curryAdd4 = curry(add, 4)
  curryAdd4(1)(2, 3)(4); // 10

  function converter(ratio, input) {
    return (input*ratio).toFixed(1);
  }
  const curriedConverter = curry(converter)
  const milesToKm = curriedConverter(1.62);
  milesToKm(35); // 56.7
  milesToKm(10); // 16.2
*/

export function curry<F extends (...args: any[]) => any, L extends number>(
  fn: F,
  arity?: L | undefined
): Curry<F, number extends L ? undefined : L, Parameters<F>[number]> {
  // @ts-ignore
  return function curried() {
    if (arity == null) {
      // @ts-ignore
      arity = fn.length
    }
    var args = [].slice.call(arguments)
    // @ts-ignore
    if (args.length >= arity) {
      // @ts-ignore
      return fn.apply(this, args)
    } else {
      return function () {
        // @ts-ignore
        return curried.apply(this, args.concat([].slice.call(arguments)))
      }
    }
  }
}
