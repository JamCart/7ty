import build from './build.js'
import chalk from 'chalk'
import chokidar from 'chokidar'

export default async function watch () {
  await build({ watch: true })

  chokidar.watch(['./static', './src'], {
    ignoreInitial: true
  }).on('all', () => {
    build({ watch: true }).catch(e => {
      console.error(e)
      console.log(chalk.red("Build aborted"))
    })
  })
}
