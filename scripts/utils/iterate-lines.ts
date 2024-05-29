import fs from 'fs'
import readline from 'readline'

export async function iterateLines(filePath: string, cb: (line: string) => Promise<void>) {
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity })

  for await (const line of rl) {
    await cb(line)
  }
}
