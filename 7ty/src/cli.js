#!/usr/bin/env node
import { spawn } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const command = process.argv.slice(2)
const __dirname = dirname(fileURLToPath(import.meta.url))

// TODO: Is there a better way to enable source maps?
spawn('node', ['--enable-source-maps', join(__dirname, '/index.mjs'), ...command], {
  cwd: process.cwd(),
  stdio: 'inherit'
})
