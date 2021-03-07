import chalk from 'chalk'

import runRollup from './build/rollup.js'
import writeHTML from './build/html.js'

export default async function build ({ watch = false }) {
  console.log(chalk.bold("\nBuild Started..."))
  console.time(chalk.green("Build Completed"))

  console.log("* Server...")
  // FIXME: Virtual CSS files are tripping up rollup's cache
  const output = await runRollup('server', { use_cache: false, watch })

  console.log("* HTML...")
  await writeHTML(output)

  console.log("* Client...")
  await runRollup('client', { use_cache: true, watch })

  console.timeEnd(chalk.green("Build Completed"))
}
