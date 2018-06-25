/**
 * Created by Denis_Pankratov on 2/24/2018.
 */
import Board from '@/components/classes/board.js'

export default class Game {
  // name = null
  playerName = null
  code = null
  allPlayersScreen = false
  /*
  var contextPath = null
  var boardSize = 0
  var registered = false
  var singleBoardGame = null

  var enableDonate = false
  var enableJoystick = false
  var enableAlways = false
  var enablePlayerInfo = true
  var enablePlayerInfoLevel = true
  var enableLeadersTable = true
  var enableChat = false
  var enableInfo = true
  var enableHotkeys = true
  var enableAdvertisement = false
  var showBody = true
  var sprites = null
  var heroInfo= null

  var board = null
  var config = {}
  */

  board = null

  constructor (config, $http) {
    this.config = config
    this.$http = $http
    this.$http.get('/rest/context').then((response) => {
      this.contextPath = response.data
    })
    this.board = new Board(this)
  }

  board () {
    return this.board
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

  getSettings (name) {
    /*
    var value = $('#settings').attr(name)

    if (typeof(value) === 'undefined') {
      return null
    }
    if (value === '') {
      return null
    }
    if (value === 'true' || value === 'false') {
      return (value === 'true')
    }
    */
    return null
  }
}
