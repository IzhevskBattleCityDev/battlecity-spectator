/**
 * Created by Denis_Pankratov on 2/24/2018.
 */
import helpers from '@/classes/helpers'
import Player from '@/classes/player'

export default class Players {
  players = []
  game = null

  constructor (game) {
    this.game = game
    window.$events.$on('players:update', this.update)
    /* нельзя использовать, так как сервис возвращает код доступов до управления игроками */
    this.game.$http.get('/rest/game/' + this.game.name + '/players').then((players) => {
      if (!game.boards.allPlayersScreen && game.boards.enablePlayerInfoLevel) {
        players.data.forEach(element => {
          let name = helpers.getNameFromEmail(element.name)
          this.players.push(new Player({
            id: helpers.toIdFromEmail(element.name),
            title: name,
            name: name,
            email: element.name,
            score: element.score,
            life: element.life,
            ammo: element.ammo
          }))
        })
      }
    })
  }
  update (scores, heroesData) {
    this.players = []
    window.$game.players.players.forEach(element => {
      if (scores[element.email] >= 0) {
        this.players.push(new Player({
          id: element.id,
          title: element.name,
          name: element.name,
          email: element.email,
          score: scores[element.email],
          life: heroesData[element.email].additionalData.life,
          ammo: heroesData[element.email].additionalData.ammo
        }))
      }
    })
    window.$events.$emit('players:view', this.players)
  }
  get list () {
    return this.players
  }
  getNames (playerList) {
    var result = []
    playerList.forEach(function (player) {
      result.push(player.name)
    })
    return result
  }
  isRegistered (playerName, code) {
    this.game.$http.get('/rest/player/' + playerName + '/check/' + code, function (registered) {
      this.game.registered = registered
    })
  }
}
