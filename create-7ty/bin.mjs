#!/usr/bin/env node
import chalk from 'chalk'
import degit from 'degit'
import mri from 'mri'
import path from 'path'
import { spawn } from 'child_process'

const REPOSITORY = 'JamCart/7ty/template'

process.on('unhandledRejection', e => { 
  console.error(chalk.red(e))
  process.exit(1)
})

async function main() {
  const args = mri(process.argv.slice(2))
  const { force } = args
  const [dest = '.'] = args._

  const emitter = degit(REPOSITORY, {
    force
  })
  emitter.on('info', info => {
    console.log(chalk.blue(info.message))
  })

  try {
    await emitter.clone(dest)
  } catch (e) {
    console.error(chalk.red(e.message))
    process.exit(1)
  }

  console.log(chalk.white(`\nInstalling dependencies...`))
  const npm = spawn('npm', ['install'], {
    cwd: path.resolve(dest),
    shell: true,
    stdio: 'inherit'
  })
  const code = await new Promise(resolve => {
    npm.on('close', resolve)
  })
  if (code) {
    console.error(chalk.red(`An error occured during installation.`))
    process.exit(1)
  }

  console.log(chalk.green(`\n\n🚀  Your new app is ready to go!\n`))
  console.log(chalk.white(`Next steps:\n`))
  if (dest !== '.') {
    console.log(chalk.cyan(`cd ${ dest }`))
  }
  console.log(chalk.cyan(`npm run dev`))
}

main()
