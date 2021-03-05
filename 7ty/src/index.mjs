import mri from 'mri'

import build from './build.js'
import watch from './watch.js'

process.on('unhandledRejection', e => { 
  console.error(e)
  process.exit(1)
})

const argv = mri(process.argv.slice(2))

if (argv.watch) {
  watch()
} else {
  build({ watch: false })
}
