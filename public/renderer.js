export default function renderScreen(screen, gameCanvas, game, requestAnimationFrame) {

  screen.clearRect(0, 0, gameCanvas.width, gameCanvas.height)

  for (const pipeId in game.state.pipes) {
    const pipe = game.state.pipes[pipeId]
    drawPipe(screen, pipe, game.state.settings.pipeWidth, game.state.settings.screenHeight)
  }

  for (const playerId in game.state.players) {
    const player = game.state.players[playerId]
    drawPlayer(screen, player, game.state.settings.playerSize, playerId === game.getLocalPlayerId())
  }

  requestAnimationFrame(() => renderScreen(screen, gameCanvas, game, requestAnimationFrame))
}

function drawPlayer(screen, player, playerSize, isLocalPlayer) {
  screen.fillStyle = isLocalPlayer ? "blue" : 'red'
  screen.fillRect(player.x - playerSize / 2, player.y - playerSize / 2, playerSize, playerSize)
  screen.textAlign = 'center';
  screen.fillStyle = 'white'
  screen.font = "14px Arial"
  screen.fillText(player.name, player.x, player.y - 30)
}

function drawPipe(screen, pipe, pipeWidth, screenHeight) {
  screen.fillStyle = 'green'
  screen.fillRect(pipe.x - (pipeWidth / 2), 0, pipeWidth, pipe.y - (pipe.gap / 2))
  screen.fillRect(pipe.x - (pipeWidth / 2), pipe.y + (pipe.gap / 2), pipeWidth, screenHeight - (pipe.y + (pipe.gap / 2)))
}
