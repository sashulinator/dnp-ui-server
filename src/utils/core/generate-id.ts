/*
 * RandomID generator
 * Version 1.1
 * Author: Michael Vieira aka Themimitoof
 * GitHub page: https://github.com/themimitoof/node-randomid
 *
 */
import { random } from './random'

export function generateId(chars = 8): string {
  const key: number[] = []

  key[0] = random(0, char.length - 1)

  let result = char[key[0]]

  for (let i = 1; i < chars; i++) {
    key[i] = random(0, char.length - 1)

    result += char[key[i]]
  }

  return result
}

export function generateUniqId(chars = 8, isUniq: (id: string) => boolean): string {
  const result = generateId(chars)
  return isUniq(result) ? result : generateUniqId(chars, isUniq)
}

const char = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'k',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
]
