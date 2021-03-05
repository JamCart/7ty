import fs from 'fs-extra'
import path from 'path'
import url from 'url'

import normalizePath from '../util/normalize-path.js'

export function flattenStylesheetImports (output) {
  const keyed = new Map(output.map(i => [i.fileName, i]))

  function* traceImports (key) {
    const chunk = keyed.get(key)
    if (chunk && chunk.imports) {
      for (let i of chunk.imports) {
        yield i
        for (let j of traceImports(i)) {
          yield j
        }
      }
    }
  }

  return new Map(output.map(i => {
    const imports = Array.from(traceImports(i.fileName))
      .filter(name => name.endsWith('.css'))
      .map(href => `<link rel="stylesheet" href="/${ normalizePath(href) }" />`)
      .join('\n')

    return [i.fileName, imports]
  }))
}

export async function getTemplate () {
  const template = await fs.readFile('./src/template.html', 'utf8')
  
  return ({ html, head }) => {
    return template
      .replace('%HEAD%', head)
      .replace('%HTML%', html)
  }
}

export async function writeHTML ({ template, file_name, stylesheets }) {
  const file_path = path.join('./build/server', file_name)
  const import_path = url.pathToFileURL(file_path)

  const component = await import(import_path)
  // TODO: Verify getPaths returns an array of objects
  const paths = component.getPaths ? await component.getPaths() : [{}]

  const output_path = path.join('./build/html', file_name.replace(/-\w+\.js$/, '.html'))

  return Promise.all(paths.map(async params => {
    const output_file = Object.entries(params).reduce((path, [key, value]) => {
      return path.replace(`[${ key }]`, value)
    }, output_path)

    // TODO: Verify getData returns an object
    const props = component.getData ? await component.getData(params) : params
    const { html, head } = component.default.render(props)
    
    const output = template({
      head: head + stylesheets,
      html
    })
    await fs.outputFile(output_file, output)  
  }))
}
