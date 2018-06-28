/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
export default class BoardsConnector {
  playerName = ''
  link = ''
  socket = null
  isOpen = false

  constructor (link, playerName) {
    this.playerName = (playerName == null) ? 'anonymous' : playerName
    this.link = link + '/screen-ws?user=' + this.playerName
  }

  run (onOpen, OnMessage) {
    this.socket = new WebSocket(this.link)
    this.socket.onopen = function () {
      console.log('Connection to board is established')
      onOpen()
    }
    this.socket.onerror = this.onError
    this.socket.onclose = this.onClose
    this.socket.onmessage = function (event) {
      OnMessage(event.data)
    }
  }

  onClose (event) {
    if (event.wasClean) {
      console.log('### Board is disconnected ###')
    } else {
      console.log('### Board is accidentally disconnected ###')
      console.log('[ERR] Code: ' + event.code + ', Reason: ' + event.reason)
    }
  }

  onError (error) {
    console.log('[ERR] Board - ' + error.message)
  }

  send (msg) {
    console.log('[INFO] Board sent message to server: ' + msg)
    this.socket.send(msg)
  }
}
