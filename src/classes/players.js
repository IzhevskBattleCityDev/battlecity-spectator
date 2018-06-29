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
      console.log(players.data)
      if (!game.boards.allPlayersScreen && game.boards.enablePlayerInfoLevel) {
        players.data.forEach(element => {
          let name = helpers.getNameFromEmail(element.name)
          this.players.push(new Player({
            id: helpers.toIdFromEmail(element.name),
            title: name,
            name: name,
            email: element.name,
            score: element.score
          }))
        })
      }
    })
  }

  update (scores) {
    this.players = []
    window.$game.players.players.forEach(element => {
      if (scores[element.email] > 0) {
        this.players.push(new Player({
          id: element.id,
          title: element.name,
          name: element.name,
          email: element.email,
          score: scores[element.email]
        }))
      }
    })
    window.$events.$emit('players:view', this.players)
  }

  get list () {
    return this.players
  }
  /*
  load() {

    loadData('/rest/game/' + game.gameName + '/players', function(players) {
      if (game.allPlayersScreen) {
        game.players = players;
      } else {
        for (var index in players) {
          if (players[index].name == game.playerName) {
            game.players = [players[index]];
          }
        }
      }

      onLoad(game.players);
    });
    loadPlayers(function(newPlayers) {
      var remove = [];
      var create = [];
      var playerNames = getNames(players);
      var newPlayerNames = getNames(newPlayers);
      newPlayers.forEach(function (newPlayer) {
        if ($.inArray(newPlayer.name, playerNames) == -1) {
          create.push(newPlayer);
        }
      });
      players.forEach(function (player) {
        if ($.inArray(player.name, newPlayerNames) == -1) {
          remove.push(player);
        }
      });

      players = newPlayers;

      removeHtml(remove);
      removeCanvases(remove);

      buildHtml(create);
      buildCanvases(create);

      if (players.length == 0) {
        goToHomePage();
      }
      reloading = false;
    });

  }
*/

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

/*
  update(function(newPlayers) {
    var remove = [];
    var create = [];
    var playerNames = this.getNames(this.players);
    var newPlayerNames = this.getNames(newPlayers);
    newPlayers.forEach(function (newPlayer) {
      if ($.inArray(newPlayer.name, playerNames) == -1) {
        create.push(newPlayer);
      }
    });
    players.forEach(function (player) {
      if ($.inArray(player.name, newPlayerNames) == -1) {
        remove.push(player);
      }
    });

    players = newPlayers;

    removeHtml(remove);
    removeCanvases(remove);

    buildHtml(create);
    buildCanvases(create);

    if (players.length == 0) {
      goToHomePage();
    }
    reloading = false;
  });
*/
}
