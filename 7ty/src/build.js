import chalk from 'chalk'
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
  const output = await runRollup('server', { watch })

  console.log("* HTML...")
  const template = await getTemplate()
  const stylesheets = flattenStylesheetImports(output)

  const writing_html = output.map(route => {
    if (route.isEntry) {
      return writeHTML({
        file_name: route.fileName,
        stylesheets: stylesheets.get(route.fileName),
        template
      })
    }
  })
  await Promise.all(writing_html)

  console.log("* Client...")
  await runRollup('client', { watch })

  console.timeEnd(chalk.green("Build Completed"))
}
