import minidom from 'minidom'

function findModules (document) {
  const scripts = document.getElementsByTagName('script')
  return Array.from(scripts).filter(tag => typeof tag.getAttribute('data-hydrate') !== 'undefined')
}

export default function () {
  const original_html = new Map()

  return {
    name: '7ty-partial-hydration',

    generateBundle (options, bundle) {
      const values = Object.values(bundle)
      const chunk_by_facade = Object.fromEntries(values.map(chunk => [chunk.facadeModuleId, chunk]))

      values.forEach(chunk => {
        if (original_html.has(chunk.facadeModuleId)) {
          const document = original_html.get(chunk.facadeModuleId)

          const preload = new Set()

          findModules(document).forEach(tag => {
            const original_import = tag.getAttribute('data-import')
            const props = tag.textContent
            const target = tag.getAttribute('data-target')

            const chunk = chunk_by_facade['./' + original_import]
            const new_import = chunk.fileName
            preload.add(chunk.fileName)
            chunk.imports.forEach(i => preload.add(i))

            const new_script = document.createElement('script')
            new_script.setAttribute('type', 'module')
            new_script.textContent = `
              import('/${ new_import }').then(({ default: component }) => { 
                new component({
                  props: ${ props },
                  hydrate: true,
                  target: document.getElementById('${ target }')
                })
              })
            `
            tag.parentNode.replaceChild(new_script, tag)
          })

          const head = document.getElementsByTagName('head')[0]
          for (let href of preload.keys()) {
            const link = document.createElement('link')
            link.setAttribute('rel', 'modulepreload')
            link.setAttribute('href', '/' + href)
            head.appendChild(link)
          }

          delete bundle[chunk.fileName]
          this.emitFile({
            type: 'asset',
            fileName: chunk.fileName.replace(/\.js$/, '.html'),
            source: document.outerHTML
          })
        }
      })
    },

    transform (code, id) {
      if (!id.endsWith('.html')) return null;

      const document = minidom(code)
      original_html.set(id, document)
    
      let generated_code = 'export default null;\n'
      generated_code += findModules(document).map((tag) => {
        return `import('$${ tag.getAttribute('data-import') }').then(m => new m.default());`
      }).join('\n')
    
      return {
        code: generated_code,
        map: { mappings: '' }
      }
    } 
  }
}
