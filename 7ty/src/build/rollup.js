import { rollup } from 'rollup'
import url from 'url'

const config_path = url.pathToFileURL('./rollup.config.mjs')
const config_promise = import(config_path)

export default async function build (type, { watch }) {
  const config = await config_promise
  const configuration = await config[type]({ watch })

  const bundle = await rollup({
    ...configuration
  })
  const { output } = await bundle.write(configuration.output)
  await bundle.close()

  return output
}
