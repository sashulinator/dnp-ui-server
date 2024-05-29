import { iterateLines, remove, add } from './lib'

run()

async function run() {
  await iterateLines(async ({ pathName }) => {
    await remove(pathName)
  })

  iterateLines(async ({ pathName, remote }) => {
    await add(pathName, remote)
  })
}
