import randomInRange from './utils.js'

export default function createGame(width, height) {
  const state = {
    settings: {
      screenWidth: width,
      screenHeight: height,
      playerSize: 30,
      pipeWidth: 60,
      speed: 0.25,
      gravity: 0.003,
      jumpForce: -0.6
    },
    players: {
    },
    pipes: {
    }
  }

  let localPlayerId = null

  function addPlayer(playerId, x, y, name) {
    const playerName = name ? name : playerId.substring(0, 10)
    const playerX = x ? x : state.settings.screenWidth / 3
    const playerY = y ? y : state.settings.screenHeight / 2
    state.players[playerId] = {
      name: playerName,
      x: playerX,
      y: playerY,
      velocity: 0
    }
  }

  function removePlayer(playerId) {
    delete state.players[playerId]
  }

  function addPipe(pipeId, x, y, gap) {
    const pipeX = x ? x : state.settings.screenWidth //+ state.settings.pipeWidth / 2
    const pipeY = y ? y : randomInRange(150, state.settings.screenHeight - 150)
    const pipeGap = gap ? gap : randomInRange(150, 250)
    state.pipes[pipeId] = {
      x: pipeX,
      y: pipeY,
      gap: pipeGap
    }
  }

  function removePipe(pipeId) {
    delete state.pipes[pipeId]
  }

  function simulate() {
    for (const playerId in state.players) {
      const player = state.players[playerId]
      player.velocity += state.settings.gravity
      player.y += player.velocity
    }
    for (const pipeId in state.pipes) {
      const pipe = state.pipes[pipeId]
      pipe.x -= state.settings.speed
    }
    removeOffscreenPipes()
    checkForCollisions()
  }

  function removeOffscreenPipes() {
    for (const pipeId in state.pipes) {
      const pipe = state.pipes[pipeId]
      if (pipe.x < -state.settings.pipeWidth) {
        removePipe(pipeId)
      }
    }
  }

  function updateState(newState) {
    Object.assign(state, newState)
  }

  function doFlap(playerId) {
    const player = state.players[playerId]
    if (player && player.y > 0) {
      player.velocity = state.settings.jumpForce
    }
  }

  function checkForCollisions() {
    for (const playerId in state.players) {
      const player = state.players[playerId]
      for (const pipeId in state.pipes) {
        const pipe = state.pipes[pipeId]
        const hasPipeLeftCollision = player.x > pipe.x - state.settings.pipeWidth / 2
        const hasPipeRightCollision = player.x < pipe.x + state.settings.pipeWidth / 2
        const hasTopPipeCollision = player.y < pipe.y - pipe.gap / 2
        const hasBottomPipeCollision = player.y > pipe.y + pipe.gap / 2
        if ((hasPipeLeftCollision && hasPipeRightCollision) && (hasTopPipeCollision || hasBottomPipeCollision)) {
          removePlayer(playerId)
        }
      }
    }
  }

  function getAliveCount() {
    return Object.keys(state.players).length
  }

  function removeAllPipes() {
    for (const pipeId in state.pipes) {
      removePipe(pipeId)
    }
  }

  function setLocalPlayerId(playerId) {
    localPlayerId = playerId
  }

  function getLocalPlayerId() {
    return localPlayerId
  }

  return {
    state,
    addPlayer,
    removePlayer,
    addPipe,
    removePipe,
    simulate,
    updateState,
    doFlap,
    getAliveCount,
    removeAllPipes,
    getLocalPlayerId,
    setLocalPlayerId
  }
}