import * as io from 'socket.io-client';
import * as R from 'ramda'
import * as ora from 'ora'
import chalk from 'chalk'
import { IComponents } from './system';

const log = R.curry((color, name, message) => {
  console.log(`${chalk.gray('customer-')}${chalk.blueBright(name)}: ${chalk[color](message)}`)
})

const logSuccess = log('green')
const logWarning = log('yellow')
const logDanger = log('red')

const connectUser = (token: string, name: string | number, carrierToFollow: string | number, host: string) => {
  const socket = io(host, {
    transports: ['websocket'],
    query: {
      token
    }
  });

  socket.on('connect', () => {
    logSuccess(name, 'connected')
    
    logWarning(name, `Trying to track carrier ${carrierToFollow}`)
    socket.emit('trackCarrier', { carrierId: carrierToFollow}, (data) => {
      if (data) {
        logSuccess(name, `Now tracking carrier ${carrierToFollow}`)
      }
    })

    socket.on('trackCarrier-error', (error) => {
      logDanger(name, `error - ${error}`)
    })

    socket.on('pos', (data) => {
      logSuccess(name, `receiving position: [${data.lat}, ${data.lng}]`)
    })
  })

  socket.on('error', (error) => {
    logDanger(name, `error - ${error}`)
  })
}

export interface IStartCustomersOptions {
  host: string,
  quantity: number,
  startIdRange: number,
  carrierId: number,
}

const idToCustomer = id => ({
  user: id,
  scopes: ['user']
})


export const startCustomers = async ({
  host,
  quantity,
  startIdRange,
  carrierId,
}: IStartCustomersOptions, components: IComponents) => {
  const spinner = ora()
  
  console.log(`${chalk.gray('Quantity')}: ${chalk.green(quantity.toString())}`)
  console.log(`${chalk.gray('Start range ID')}: ${chalk.green(startIdRange.toString())}`)
  console.log(`${chalk.gray('Carrier ID')}: ${chalk.green(carrierId.toString())}`)
  
  spinner.start(`Obtaining tokens from ${startIdRange} to ${startIdRange + quantity - 1}`)
  const tokens = await R.pipe(
    R.map(idToCustomer),
    R.map(components.token.encode),
    (tokenPromises) => Promise.all(tokenPromises),
  )(R.range(startIdRange, startIdRange + quantity))

  spinner.succeed()
  
  R.pipe(
    R.addIndex(R.map)((token, i) => connectUser(token, i + startIdRange, carrierId, host))
  )(tokens) 
}