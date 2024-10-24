import { dropOperationalDatabase } from './drop-operational-database'
import { dropTargetDatabase } from './drop-target-database'

async function main() {
  await dropOperationalDatabase()
  await dropTargetDatabase()
}

;(() => {
  main().then(() => process.exit(0))
})()
