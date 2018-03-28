#!/usr/bin/env node
import * as yargs from 'yargs'
import { Argv } from 'yargs';

yargs
  .command('carrier', 'start carriers', (yargs: Argv) => {
    return yargs
      .positional('host', {
        describe: 'server host',
        default: 'http://localhost:3000'
      })
  }, (argv: yargs.Arguments) => {
    console.log(argv.host)
  })
  .option('verbose', {
    alias: 'v',
    default: false
  })
  .argv