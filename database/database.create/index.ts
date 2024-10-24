import { createOperationalDatabase } from './create-operational-database'
import { createTargetDatabase } from './create-target-database'

async function main() {
  await createOperationalDatabase()
  await createTargetDatabase()
}

;(() => {
  main().then(() => process.exit(0))
})()
