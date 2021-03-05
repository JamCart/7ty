import runRollup from './build/rollup.js'
import {
  flattenStylesheetImports,
  getTemplate,
  writeHTML
} from './build/html.js'

export default async function build ({ watch = false }) {
  console.log("") // Deliberate blank line
  console.log("Build started...")
  console.time("Build completed")

  const output = await runRollup('server', { watch })

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

  await runRollup('client', { watch })

  console.timeEnd("Build completed")
  console.log("") // Deliberate blank line
}
