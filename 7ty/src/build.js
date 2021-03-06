import chalk from 'chalk'
import fs from 'fs-extra'

import runRollup from './build/rollup.js'
import {
  flattenStylesheetImports,
  getTemplate,
  writeHTML
} from './build/html.js'

export default async function build ({ watch = false }) {
  console.log(chalk.bold("\nBuild Started..."))
  console.time(chalk.green("Build Completed"))

  console.log("* Server...")
  // FIXME: Virtual CSS files are tripping up rollup's cache
  const output = await runRollup('server', { use_cache: false, watch })

  console.log("* HTML...")
  const template = await getTemplate()
  const stylesheets = flattenStylesheetImports(output)

  const writing_html = output
    .filter(route => route.isEntry)
    .map(async route => {
      const file_name = route.fileName

      const html_files = await writeHTML({
        file_name,
        stylesheets: stylesheets.get(file_name),
        template
      })
      return [file_name, html_files]
    })
  await Promise.all(writing_html)

  console.log("* Client...")
  await runRollup('client', { use_cache: true, watch })

  console.timeEnd(chalk.green("Build Completed"))
}
