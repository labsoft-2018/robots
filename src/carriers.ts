import * as io from 'socket.io-client';
import * as R from 'ramda'
import { IComponents } from './system';
import * as ora from 'ora'
import chalk from 'chalk'

const stopSendingPosition = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId)
  }
}
const log = R.curry((color, name, message) => {
  console.log(`${chalk.grey('carrier-')}${chalk.magentaBright(name)}: ${chalk[color](message)}`)
})

const logSuccess = log('green')
const logWarning = log('yellow')
const logDanger = log('red')

const startSendingPosition = (socket, interval) => {
  return setInterval(() => {
    socket.emit('pos', {
      lat: -34.397 + (Math.random() - 0.5) * 0.1,
      lng: 150.644 + (Math.random() - 0.5) * 0.1,
    })
  }, interval)
}

const connectCarrier = (token: string, name: string | number, host: string, interval: number) => {
  let intervalId
  
  logWarning(name, 'connecting...')
  const socket = io(host, {
    transports: ['websocket'],
    query: {
      token
    },
    autoConnect: false,
  });

  socket.connect()

  socket.on('connect', () => {
    logSuccess(name, 'connected')
    logSuccess(name, 'sending position...')
    intervalId = startSendingPosition(socket, interval)
  })

  socket.on('error', (err) => {
    logDanger(name, `error - ${err}`)
    stopSendingPosition(intervalId)
  })

  socket.on('disconnect', () => {
    logDanger(name, `disconnected`)
    stopSendingPosition(intervalId)
  })

  return socket
}

export interface IStartCarrierOptions {
  host: string,
  quantity: number,
  startIdRange: number,
  interval: number,
}

const idToCarrier = id => ({
  user: id,
  scopes: ['carrier']
})

export const startCarriers = async ({
  host,
  quantity,
  startIdRange,
  interval,
}: IStartCarrierOptions, components: IComponents) => {
  const spinner = ora()
  
  console.log(`${chalk.gray('Quantity')}: ${chalk.green(quantity.toString())}`)
  console.log(`${chalk.gray('Start range ID')}: ${chalk.green(startIdRange.toString())}`)
  console.log(`${chalk.gray('Interval')}: ${chalk.green(interval.toString())}`)
  
  spinner.start(`Obtaining tokens from ${startIdRange} to ${startIdRange + quantity - 1}`)
  const tokens = await R.pipe(
    R.map(idToCarrier),
    R.map(components.token.encode),
    (tokenPromises) => Promise.all(tokenPromises),
  )(R.range(startIdRange, startIdRange + quantity))

  spinner.succeed()
  
  R.pipe(
    R.addIndex(R.map)((token, i) => connectCarrier(token, i + startIdRange, host, interval))
  )(tokens) 
}