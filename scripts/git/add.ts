import util from 'util'

import { ExecResult } from '../types/exec-result'

const exec = util.promisify(require('child_process').exec)

export function add(include: string[]): Promise<ExecResult> {
  return exec(`git add ${include.join(' ')}`)
}
