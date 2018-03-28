import * as io from 'socket.io-client';
import * as R from 'ramda'

const HEARTBEAT_INTERVAL = 2500
const HOST = 'http://localhost:3000'
const CARRIER_1_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMSIsInNjb3BlcyI6WyJjYXJyaWVyIl0sImlhdCI6MTUyMjIwMTk4MCwiZXhwIjoxNTI0NzkzOTgwLCJhdWQiOiJ1c2VyIiwiaXNzIjoicXVhY2stcGFjayJ9.OtZlh8x_6lRqJ_O6DI1bKdRK5W3Viulb4bRtDFwwDcq-jjgNMzTGDPbmWd3wuyGaauftJFQ1jc_8_ovwJuSQgJ1H96C9qGWlB-EZWPE70JApvthbZ-u5rYZrxE3ElbOQRjdpKBod7THedTxjal5665DWhnQsJKr4F2Qw6WQGiUG_TBAi5J5ETXRegaVcmYR9JX7lteOTmkCBIoSCafB4HwHa0Qhrp2V_fGj8aoNK9E0b0euHqkkHHA6PvXRDH8jgaohWaJQXF17PpsYeD-cWzuiAPlmFWSPDnIzMaD6Wv9dXa5CWu73DBC9omkPLudbumwvrfyQJhJBPDQJU51yPwg'

const stopSendingPosition = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId)
  }
}
const startSendingPosition = (socket) => {
  return setInterval(() => {
    socket.emit('pos', {
      lat: -34.397 + (Math.random() - 0.5) * 0.1,
      lng: 150.644 + (Math.random() - 0.5) * 0.1,
    })
  }, HEARTBEAT_INTERVAL)
}

const connectUser = (name, token) => {
  let intervalId
  
  console.log(`connecting user ${name}...`)
  const socket = io(HOST, {
    transports: ['websocket'],
    query: {
      token
    },
    autoConnect: false,
  });

  socket.connect()

  socket.on('connect', () => {
    console.log(`connected ${name}`)
    intervalId = startSendingPosition(socket)
  })

  socket.on('error', (err) => {
    console.log(`error ${name} - ${err}`)
    stopSendingPosition(intervalId)
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
    stopSendingPosition(intervalId)
  })
}

const main = () => {
  connectUser('with-auth', CARRIER_1_TOKEN)
  connectUser('no-auth', '')
}

main()


