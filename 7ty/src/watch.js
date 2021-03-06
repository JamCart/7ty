import build from './build.js'
import chalk from 'chalk'
import chokidar from 'chokidar'

function asyncDebounce (fn) {
  let current
  let repeat
  
  return async function debounced (...args) {
    if (current) {
      repeat = true
      return
    }
  
    current = fn(...args)
    await current
    current = null
  
    if (repeat) {
      repeat = false
      debounced()
    }
  }
}


export default async function watch () {
  await build({ watch: true })

  chokidar.watch(['./static', './src'], {
    ignoreInitial: true
  }).on('all', asyncDebounce(() => {
    return build({ watch: true }).catch(e => {
      console.error(e)
      console.log(chalk.red("Build aborted"))
    })
  }))
}
