import fs from 'fs-extra'
import path from 'path'
import url from 'url'

import normalizePath from '../util/normalize-path.js'


function* traceImports (key, map) {
  const imports = map.get(key) || []
  for (let i of imports) {
    yield i
    for (let j of traceImports(i, map)) {
      yield j
    }
  }
}

export function flattenImports (output) {
  const keyed = new Map(output.map(i => {
    const imports = i.imports || []
    return [i.fileName, imports]
  }))

  return output
    .filter(i => i.isEntry)
    .map(i => {
      // Typecast to Set to guarantee uniqueness
      const imports = [...new Set(traceImports(i.fileName, keyed))]
        .filter(name => name.endsWith('.css'))
        .map(normalizePath)

      return [i.fileName, imports]
    })
}

export async function getTemplate () {
  const template = await fs.readFile('./src/template.html', 'utf8')
  
  return ({ html, head }) => {
    return template
      .replace('%HEAD%', head)
      .replace('%HTML%', html)
  }
}

function substitueParameters (path, params) {
  return path.replace(/\[(.+?)\]/, (_, key) => {
    if (key in params) {
      return params[key]
    } else {
      return `[${ key }]`
    }
  })  
}


async function writeHTML ({ template, file_name, stylesheets }) {
  const file_path = path.join('./build/server', file_name)
  const import_path = url.pathToFileURL(file_path)
  const output_path = path.join('./build/html', file_name.replace(/-\w+\.js$/, '.html'))
  const stylesheet_links = stylesheets.map(href => `<link rel="stylesheet" href="/${ href }" />`).join('\n')

  const {
    default: component,
    getData = (i) => { return i },
    getPaths = () => { return [{}] }
  } = await import(import_path)

  // TODO: Verify getPaths returns an array of objects
  const paths = await getPaths()
  return Promise.all(paths.map(async params => {
    const output_file = substitueParameters(output_path, params)

    // TODO: Verify getData returns an object
    const props = await getData(params)
    const { html, head } = component.render(props)
    
    const output = template({
      head: head + stylesheet_links,
      html
    })
    await fs.outputFile(output_file, output)
    return output_file
  }))
}


export default async function (rollupOutput) {
  const template = await getTemplate()
  const entry_files = flattenImports(Object.values(rollupOutput))

  const writing_html = entry_files.map(async ([file_name, stylesheets]) => {
    const html_files = await writeHTML({
      file_name,
      stylesheets,
      template
    })
    return [file_name, html_files]
  })
  return await Promise.all(writing_html)
}
