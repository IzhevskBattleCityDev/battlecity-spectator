/**
 * Created by Denis_Pankratov on 2/24/2018.
 */
import BoardsConnector from '@/classes/boardsConnector'
import Board from '@/classes/board'
import Helpers from '@/classes/helpers'

export default class Boards {
  game = null
  singleBoardGame = true
  isGraphicOrTextGame = true
  allPlayersScreen = false
  enablePlayerInfoLevel = true

  boardsList = {}

  boardSize = 0
  link = null
  players = null

  plots = {}
  plotSize = 0
  canvasSize = 0

  _plotsUrls = {}
  _images = []
  screen = {}
  loaded = false

  constructor (game) {
    this.game = game
    this._playerName = this.game.currentPlayer
    window.$events.$on('boards:update', this.update)
    this.connection = new BoardsConnector(this.game.WSLink, this._playerName)
    this.connection.run(this.onOpen, this.onMessage)
    this.game.$http.get('/rest/game/' + this.game.name + '/type')
      .then((playerGameInfo) => {
        this.singleBoardGame = playerGameInfo.data.singleBoard
        this.boardSize = playerGameInfo.data.boardSize
      }).then(() => {
        this.game.$http.get('/rest/sprites/' + this.game.name + '/exists').then((isGraphicOrTextGame) => {
          this.isGraphicOrTextGame = isGraphicOrTextGame.data
        }).then(() => {
          this.loadSprites().then(() => {
            this.loadImages()
            this.loaded = true
          })
        })
      })
  }

  onOpen () {
    window.$game.boards.refresh()
  }

  onMessage (data) {
    window.$game.boards.refresh()
    let _data = JSON.parse(data)
    if (window.$game.boards.singleBoardGame || !window.$game.boards.allPlayersScreen) {
      let _item = {}
      _item[window.$game.currentPlayer] = _data[window.$game.currentPlayer]
      /* eslint-disable */
      window.$game.boards.update.call(window.$game.boards, _item)
      /* eslint-enable */
    } else {
      // игра на которой надо показывать все поля одновременно
      /* eslint-disable */
      window.$game.boards.update.call(window.$game.boards, _data)
      /* eslint-enable */
    }
    if (window.$game.boards.loaded) {
      window.$events.$emit('players:update', _data[window.$game.currentPlayer].scores)
    }
  }

  loadSprites () {
    let sprites = ''
    let _ = this
    return this.game.$http.get('/rest/sprites/alphabet').then((response) => {
      var alphabet = response.data
      return _.game.$http.get('/rest/sprites/' + _.game.name).then((response) => {
        var elements = response.data
        for (var index in elements) {
          let char = alphabet[index]
          let color = elements[index]
          _.plots[char] = color
          let subFolder = (!sprites) ? sprites + '/' : ''
          _._plotsUrls[color] = _.game.$http.defaults.baseURL + '/resources/sprite/' + _.game.name + '/' + subFolder + color + '.png'
        }
      })
    })
  }

  loadImages () {
    let _ = this
    let firstSprite = null
    for (var color in this._plotsUrls) {
      var image = new Image()
      image.onload = function () {
        if (this === firstSprite) {
          _.calcSize(this)
        }
      }
      image.src = this._plotsUrls[color]
      this._images[color] = image
      if (!firstSprite) {
        firstSprite = image
      }
    }
  }
  calcSize (image) {
    this.plotSize = image.width
  }
  update (data) {
    for (var prop in data) {
      if (this.boardsList.hasOwnProperty(prop)) {
        this.boardsList[prop].update(data[prop])
      } else {
        this.boardsList[prop] = new Board(Helpers.getIdfromEmail(prop), data[prop], this.plots, this.plotSize, this._images)
      }
    }
    // TODO: чистить старые доски
    // --------
    window.$events.$emit('boards-view:update', this.boardsList)
  }

  refresh () {
    if (this.connection) {
      var request = {
        'name': 'getScreen',
        'allPlayersScreen': this.allPlayersScreen,
        'players': [this._playerName],
        'gameName': this.game.name
      }
      this.connection.send(JSON.stringify(request))
    }
  }
}
