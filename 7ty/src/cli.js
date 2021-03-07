#!/usr/bin/env node
import { fork } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const command = process.argv.slice(2)
const __dirname = dirname(fileURLToPath(import.meta.url))

// TODO: Is there a better way to enable source maps?
const proc = fork(join(__dirname, '/index.mjs'), command, {
  env: {},
  execArgv: ['--enable-source-maps'],
  stdio: 'inherit'
})
proc.on('close', code => process.exit(code))
