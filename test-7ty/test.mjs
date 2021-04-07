import chalk from 'chalk'
import fs from 'fs-extra'
import { spawn } from 'child_process'
import waitOn from 'wait-on'

process.on('unhandledRejection', e => { 
  console.error(chalk.red(e))
  process.exit(1)
})

async function run (command, args, { cwd } = {}) {
  const npm = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'inherit'
  })
  await new Promise(resolve => {
    npm.on('close', code => {
      if (code) {
        throw new Error(`An error occured during execution.`)
      }
      resolve(code)
    })
  })
}

async function main () {
  console.log("Deleting target directory...")
  await fs.emptyDir('./.build')

  console.log("Installing 7ty...")
  await run('npx', ['@jamcart/create-7ty', './.build'])

  console.log("Building project...")
  await run('npm', ['run', 'build'], {
    cwd: './.build'
  })

  console.log("Starting web server...")
  run('npx', ['sirv-cli', './.build/public', '--port', '5000', '--quiet'])
  await waitOn({
    resources: ['http://localhost:5000'],
    timeout: 5 * 1000
  })

  console.log("Running tests...")
  await run('npx', ['cypress', 'run'])

  console.log(chalk.green('All tests passed!'))
  process.exit(0)
}

main()
