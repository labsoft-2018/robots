#!/usr/bin/env node
import * as yargs from 'yargs'
import { Argv } from 'yargs';
import { mainSystem } from './system';
import { startCarriers } from './carriers';
import { startCustomers } from './customers';

yargs
  .command('carrier', 'start carriers', (yargs: Argv) => {
    return yargs
      .option('host', {
        alias: 'h',
        describe: 'server host',
        default: 'http://localhost:3000'
      })
      .option('quantity', {
        describe: 'quantity of carriers',
        default: 1,
      })
      .option('id', {
        describe: 'id of the first generated carrier',
        default: '1'
      })
      .option('interval', {
        describe: 'position heartbeat interval',
        default: 2500
      })
  }, async (argv: yargs.Arguments) => {
    const components = await mainSystem.start()
    const {
      host,
      quantity,
      id: startIdRange,
      interval
    } = argv
    
    await startCarriers({
      host,
      quantity,
      startIdRange,
      interval,
    }, components)
  })
  .command('customer', 'start carriers', (yargs: Argv) => {
    return yargs
      .option('host', {
        alias: 'h',
        describe: 'server host',
        default: 'http://localhost:3000'
      })
      .option('quantity', {
        describe: 'quantity of customers',
        default: 1,
      })
      .option('id', {
        describe: 'id of the first generated customer',
        default: '1'
      })
      .option('carrierId', {
        describe: 'id of the carrier to follow',
        default: '1'
      })
  }, async (argv: yargs.Arguments) => {
    const components = await mainSystem.start()
    const {
      host,
      quantity,
      id: startIdRange,
      carrierId,
    } = argv
    
    await startCustomers({
      host,
      quantity,
      startIdRange,
      carrierId,
    }, components)
  })
  .option('verbose', {
    alias: 'v',
    default: false
  })
  .argv