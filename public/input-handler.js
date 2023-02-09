export default function createInputHandler() {
  const state = {
    playerId: null,
    observers: []
  }

  document.addEventListener('mousedown', mouseDownHandler)

  function registerPlayerId(playerId) {
    state.playerId = playerId
  }

  function mouseDownHandler() {
    broadcast({
      type: 'mouseDown',
      playerId: state.playerId
    })
  }

  function subscribe(callback) {
    state.observers.push(callback)
  }

  function unsubscribe(callback) {
    state.observers.splice(state.observers.indexOf(callback), 1)
  }

  function broadcast(data) {
    state.observers.forEach(observer => {
      observer(data)
    })
  }

  return {
    registerPlayerId,
    subscribe,
    unsubscribe
  }
}