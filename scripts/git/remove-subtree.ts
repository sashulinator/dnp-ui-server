import { spawn } from 'child_process'

import { ExecResult } from '../types/exec-result'

export async function removeSubtree(pathName: string): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    let stderr = ''
    let stdout = ''

    const stream = spawn(
      `(export FILTER_BRANCH_SQUELCH_WARNING=1 && git filter-branch --index-filter 'git rm --cached --ignore-unmatch -rf ${pathName}' --prune-empty -f HEAD)`,
      {
        shell: true,
      }
    )

    stream.stdout?.on('data', (data) => {
      stdout += data.toString()
    })

    stream.stderr?.on('data', (data) => {
      stderr += data.toString()
    })

    stream.on('close', () => {
      if (stderr) {
        reject({ stdout, stderr })
      }
      resolve({ stderr, stdout })
    })
  })
}
