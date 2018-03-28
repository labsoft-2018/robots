import * as io from 'socket.io-client';
import * as R from 'ramda'

const TOTAL_USERS = 1
const HOST = 'http://localhost:3000'

const USER_2_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMiIsInNjb3BlcyI6WyJ1c2VyIl0sImlhdCI6MTUyMjIwNjgxMiwiZXhwIjoxNTI0Nzk4ODEyLCJhdWQiOiJ1c2VyIiwiaXNzIjoicXVhY2stcGFjayJ9.e3oaJoUiY3g4bQrL1h4U0F6pAn9SYyh2YsE98-CRkT3xK8cjHrkFbUp6wPc2k4trMuwd1YFRgZbD9eVkQPGbl12oRLtUvWTrQLNQcJe59zkgySsHLEKh6j5OXg2vc12ltmWoWy8jjPNhVNnJAs_qRX7PO4s8d60faZMVsCd3iaUn3C1uWJpjdh9SGl-xEhDdqdFC52Tg3NT4PZ-yIjRCTwx8ch-bn1DEN5lZ5lvvqTdILpV-2iEEFtlD8J5j7_kSSvBMkI_arMIAJSfl29jUgC1kIWX_-QOcVoFc725dAfCuz6z6fKUX0mGKg7nUNmEZmWeSzaqPys35tB7jMctE-g'
const USER_3_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMyIsInNjb3BlcyI6WyJ1c2VyIl0sImlhdCI6MTUyMjIwNjgzNiwiZXhwIjoxNTI0Nzk4ODM2LCJhdWQiOiJ1c2VyIiwiaXNzIjoicXVhY2stcGFjayJ9.VITeTqFddnAD5eY9UfQSRxr_Igf54uuky_HdwDNU3PZnyXrUj4Set44144mT_91ozwiGw6-NY8U0oul3AuTwGnLB8NgmS2zv2F-eDq6nSph4-GSivA3ehkLl0on0in-2cNo0wyn7HSdBAtVfzOv2Gujk75gtJtYURTD5eRlw-C1OXx3gctKNTgNZ651ltHaagVvgiES5EhjO-Rgqb90k6nEcaK60Ti2QHdbnEixJawgw0brm9R9QlwxhE4OcxuraqMHvwjrCcJK_KpEiTpRUDoWvKFe1rFeYMs2reZIHaJwGrXADw9pIiWld4Xh8ZQW-dr9wceeVgrmYCWYNdd__KA'
const ADMIN_4_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNCIsInNjb3BlcyI6WyJhZG1pbiJdLCJpYXQiOjE1MjIyMDY4NTQsImV4cCI6MTUyNDc5ODg1NCwiYXVkIjoidXNlciIsImlzcyI6InF1YWNrLXBhY2sifQ.mzSEIwSF-O1Ld7FI-aKHyiF2Id0rcSOwAQdllT-uiiUgtfoI1sFALFu6ZB6-lmDuc9eRamrEig7qTXXAHIbdGOzeJDVaC3EQoYz9HzaH9FHXCyjYfg4lrHsWU-jkOGyvIx6T6aMXMAmerH54fz3VtsBvPdznrbEkqOhjkaEtx4BGtBn7w5CLwLWIstwzngfq0HZ1P1FUQ9KbFjaeVAUL_PANq_2-6xBj8CShpS5QlJWrTB_q_AiR5VHvXhncXmoRSNlkfmryb-4rukPqvo7LY55L4WiiXso_joJtirGyGOTf57xOGKwYbdDyqlOC6XLIQHOYXKGkvqKxYlSyhdt0GQ'


const connectUser = (name, carrierToFollow, token) => {
  const socket = io(HOST, {
    transports: ['websocket'],
    query: {
      token
    }
  });

  socket.on('connect', () => {
    console.log(`Connected! ${name}`)
    
    console.log(`trying to track carrier ${carrierToFollow}`)
    socket.emit('trackCarrier', { carrierId: carrierToFollow}, (data) => {
      if (data) {
        console.log(`Now tracking carrier ${carrierToFollow}`)
      }
    })

    socket.on('trackCarrier-error', (error) => {
      console.log('trackCarrierError: ', error)
    })

    socket.on('pos', (data) => {
      console.log('receiving pos ', data)
    })
  })

  socket.on('error', (err) => {
    console.log(err)
  })

  // socket.on('joined', data => {
  //   console.log(`succesfully joined room ${roomName}`)
  // })
  
  // socket.on('disconnect', () => {
  //   connectedUsers--
  //   console.log('Disconnected!')
  // })
  
  // socket.on('pos', (data) => {
  //   console.log('receiving pos ' + data.lat + ', ' + data.lng)
  // })
}

const main = () => {
  console.log('---------- CUSTOMER ----------')
  const carrierToFollow = '1'
  connectUser('user-1', carrierToFollow, USER_2_TOKEN)
}

main() 


