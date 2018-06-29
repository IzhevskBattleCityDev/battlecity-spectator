/**
 * Created by Denis_Pankratov on 2/24/2018.
 */
import Boards from '@/classes/boards'
import Players from '@/classes/players'

export default class Game {
  link = null
  code = null
  allPlayersScreen = false

  _boards = null
  _currentPlayer = null
  _players = null

  constructor (config, $http) {
    this.config = config
    this.$http = $http
    this.$http.get('/rest/context').then((response) => {
      this.contextPath = response.data
    })
    this.$http.get('/board/game/' + this.name).then((info) => {
      this.link = info.request.responseURL
      let playerName = this.link.substring(this.link.indexOf('/board/player') + 14)
      this._currentPlayer = playerName
      this._boards = new Boards(this)
      this._players = new Players(this)
    })
  }

  get currentPlayer () {
    return this._currentPlayer
  }

  get players () {
    return this._players
  }

  get boards () {
    return this._boards
  }

  get name () {
    return this.config.name
  }

  get WSLink () {
    return this.config.baseWS
  }

  get RESTLink () {
    return this.config.baseURL
  }
}
