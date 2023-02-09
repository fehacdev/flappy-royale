import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import createGame from './public/game.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const game = createGame(432, 768)
const tickRate = 1000 / 32
const simulationRate = 30 / 1000

setInterval(() => {
  game.simulate()
}, simulationRate)

setInterval(() => {
  io.emit('updateState', game.state)
}, tickRate)


let gameStarted = false

setInterval(() => {
  if (gameStarted) {
    game.addPipe(Math.random() * 10000)
  }
  if (game.getAliveCount() === 0) {
    gameStarted = false
    game.removeAllPipes()
    io.emit('reconnect')
  }
}, 1500)

app.use(express.static('public'))

io.on('connection', (socket) => {
  if (!gameStarted) {
    gameStarted = true
  }

  console.log(`${socket.id} connected to the server`)

  game.addPlayer(socket.id)

  socket.on('disconnect', () => {
    game.removePlayer(socket.id)
  })

  socket.on('doFlap', () => {
    game.doFlap(socket.id)
  })
})

server.listen(3000, () => {
  console.log("Listening on *:3000")
})