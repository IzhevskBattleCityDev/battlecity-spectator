/**
 * Created by Denis_Pankratov on 2/24/2018.
 */
import BoardsConnector from '@/classes/boardsConnector.js'

export default class Boards {
  game = null
  singleBoardGame = true
  isGraphicOrTextGame = true
  allPlayersScreen = false
  enablePlayerInfoLevel = true

  boardSize = 0
  link = null
  players = null
  plots = {}
  _plotsUrls = {}
  _images = []
  screen = {}
  loaded = false

  constructor (game) {
    this.game = game
    this._playerName = this.game.currentPlayer
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
    /*
    loadPlayers(function (players) {
     if (game.isGraphicOrTextGame) {
       initCanvases(game.contextPath, game.players, game.allPlayersScreen,
       game.singleBoardGame, game.boardSize,
       game.gameName, game.enablePlayerInfo,
       game.enablePlayerInfoLevel,
       game.sprites, game.drawBoard);
     } else {
       initCanvasesText(game.contextPath, game.players, game.allPlayersScreen,
       game.singleBoardGame, game.boardSize,
       game.gameName, game.enablePlayerInfo,
       game.enablePlayerInfoLevel, game.drawBoard);
     }

     initJoystick(game.playerName, game.registered, game.code, game.contextPath);

     if (game.enableLeadersTable) {
      initLeadersTable(game.contextPath, game.playerName, game.code);
     }

     if (game.enableChat) {
     initChat(game.playerName, game.registered,
     game.code, game.contextPath,
     game.gameName);
     }
     if (!game.enableInfo) {
     $("#fork-me").hide();
     $("#how-to-play").hide();
     }

     if (game.enableHotkeys) {
     // do nothing because hotkeys init itself
     }

     if (game.enableAdvertisement) {
     initAdvertisement();
     }

     if (game.showBody) {
     $(document.body).show();
     }

     if (game.allPlayersScreen) {
     if (!!game.onBoardAllPageLoad) {
     game.onBoardAllPageLoad();
     }
     } else {
     if (!!game.onBoardPageLoad) {
     game.onBoardPageLoad();
     }
     }
    })
    */
  }

  onOpen () {
    window.$game.boards.update()
  }

  onMessage (data) {
    window.$game.boards.update()
    if (window.$game.boards.loaded) {
      let _data = JSON.parse(data)
      window.$events.$emit('boards:update', _data)
      window.$events.$emit('players:update', _data[window.$game.currentPlayer].scores)
    }
  }

  loadSprites () {
    let sprites = ''
    let _ = this
    return this.game.$http.get('/rest/sprites/alphabet').then((response) => {
      var alphabet = response.data
      _.game.$http.get('/rest/sprites/' + _.game.name).then((response) => {
        var elements = response.data
        for (var index in elements) {
          var char = alphabet[index]
          var color = elements[index]
          _.plots[char] = color
          let subFolder = (!sprites) ? sprites + '/' : ''
          _._plotsUrls[color] = _.game.contextPath + '/resources/sprite/' + _.game.name + '/' + subFolder + color + '.png'
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

  update (screen) {
    this.screen = screen
    if (this.connection == null) {
      return
    }
    var request = {
      'name': 'getScreen',
      'allPlayersScreen': this.allPlayersScreen,
      'players': [this._playerName],
      'gameName': this.game.name
    }
    this.connection.send(JSON.stringify(request))
  }
}

/*
function initCanvases(contextPath, players, allPlayersScreen,
                      singleBoardGame, boardSize, gameName,
                      enablePlayerInfo, enablePlayerInfoLevel,
                      sprites, drawBoard)
{
  var canvases = {};
  var infoPools = {};
  currentBoardSize = boardSize;
  var plots = {};
  var plotsUrls = {};
  loadCanvasesData();
  var reloading = false;

  function reloadCanvasesData() {
    reloading = true;

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

      removeCanvases(remove); - удаляем канвас игроков которых нет

      buildHtml(create);
      buildCanvases(create);

      reloading = false;
    });
  }

  function loadCanvasesData() {
    loadData('/rest/sprites/alphabet', function(alphabet) {
      loadData('/rest/sprites/' + gameName, function(elements) {
        for (var index in elements) {
          var char = alphabet[index];
          var color = elements[index];
          plots[char] = color;
          var subFolder = (!!sprites) ? sprites + '/' : '';
          plotsUrls[color] = contextPath + '/resources/sprite/' + gameName + '/' + subFolder + color + '.png';
        }

        buildHtml(players);
        buildCanvases(players);

        $('body').on('board-updated', function(events, data) {
          if (!reloading) {
            drawUsersCanvas(data);
          }
        });
      });
    });
  }

  function buildHtml(playersList) {
    var templateData = [];
    playersList.forEach(function (player) {
      var playerName = player.name;
      var id = toId(playerName);
      var name = playerName.split('@')[0];
      var visible = (allPlayersScreen || !enablePlayerInfoLevel) ? 'none' : 'block';
      templateData.push({name : name, id : id, visible : visible })
    });
    $('#players_container script').tmpl(templateData).appendTo('#players_container');
    if (!enablePlayerInfo) {
      $(".player_info").hide();
    }
  }

  function removeCanvases(playersList) {
    playersList.forEach(function (player) {
      delete canvases[player.name];
      delete infoPools[player.name];
    });
  }

  function buildCanvases(playersList) {
    playersList.forEach(function (player) {
      canvases[player.name] = createCanvas(toId(player.name));
      infoPools[player.name] = [];
    });
  }

  function decode(char) {
    return plots[char];
  }

  function plotsContains(color) {
    for (var char in plots) {
      if (plots[char] == color) {
        return true;
      }
    }
    return false;
  }

  var getBoardDrawer = function(canvas, playerName, playerData, allPlayersScreen) {
    var getBoard = function() {
      return playerData.board;
    }
    var getHeroesData = function(isAll) {
      if (isAll) {
        var result = {};
        for (var name in playerData.heroesData) {
          result[name] = playerData.heroesData[name][name];
        }
        return result;
      } else {
        return playerData.heroesData[playerName];
      }
    }

    var drawAllLayers = function(layers, onDrawItem){
      var isDrawByOrder = true;

      var drawChar = function(plotIndex) {
        var x = 0;
        var y = boardSize - 1;
        for (var charIndex in layers[0]) {
          for (var layerIndex in layers) {
            var layer = layers[layerIndex];
            var color = layer[charIndex];
            if (!isDrawByOrder || plotIndex == color) {
              canvas.drawPlot(decode(color), x, y);
              if (!!onDrawItem) {
                onDrawItem(layers, layerIndex, charIndex, x, y);
              }
            }
          }
          x++;
          if (x == boardSize) {
            x = 0;
            y--;
          }
        }
      }

      if (isDrawByOrder) {
        for (var char in plots) {
          var plot = plots[char];
          drawChar(char);
        }
      } else {
        drawChar();
      }
    }

    var drawBackground = function(name) {
      if (plotsContains(name)) {
        var x = boardSize / 2 - 0.5;
        canvas.drawPlot(name, x, 0);
      }
    }

    var drawBack = function() {
      drawBackground('background');
    }

    var drawFog = function() {
      drawBackground('fog');
    }

    var clear = function() {
      canvas.clear();
    }

    var drawLayers = function(onDrawItem) {
      var board = getBoard();
      try {
        drawAllLayers(board.layers, onDrawItem);
      } catch (err) {
        try {
          drawAllLayers([board], onDrawItem);
        } catch (err) {
          console.log(err);
        }
      }
    }

    var drawPlayerNames = function(font, beforeDraw) {
      try {
        var drawName = function(name, point, font, heroData, isHero) {
          var name = getNameFromEmail(name);
          var data = {
            'name':name,
            'point':point,
            'font':font,
            'heroData':heroData
          }
          if (!!beforeDraw) data = beforeDraw(data);
          canvas.drawText(data.name, data.point, data.font, isHero === true ? '#FFFB00' : null);
        }

        var board = getBoard();
        if (singleBoardGame || !!board.showName) {
          var currentPoint = null;
          var currentHeroData = null;
          var heroesData = getHeroesData(singleBoardGame);
          for (var name in heroesData) {
            var heroData = heroesData[name];
            var point = heroData.coordinate;
            if (!point) return; // TODO why this can happen?
            if (point.x == -1 || point.y == -1) return;
            if (!!board.offset) {
              point.x -= board.offset.x;
              point.y -= board.offset.y;
            }
            if (playerName == name) {
              currentPoint = point;
              currentHeroData = heroData;
            }
            if (!board.onlyMyName && !!heroData.singleBoardGame) {
              drawName(name, point, font, heroData, playerName === name);
            }
          }
          drawName(playerName, currentPoint, font, currentHeroData, true);
        }
      } catch (err) {
        console.log(err);
      }
    }

    return {
      clear : clear,
      drawBack : drawBack,
      drawLayers : drawLayers,
      drawPlayerNames : drawPlayerNames,
      drawFog : drawFog,
      canvas : canvas,
      playerName : playerName,
      playerData : playerData,
      allPlayersScreen : allPlayersScreen
    };
  };

  function defaultDrawBoard(drawer) {
    drawer.clear();
    drawer.drawBack();
    drawer.drawLayers();
    drawer.drawPlayerNames();
    drawer.drawFog();
  }

  drawBoard = (!!drawBoard) ? drawBoard : defaultDrawBoard;

  function calculateTextSize(text) {
    var div = $("#width_calculator_container");
    div.html(text);
    div.css('display', 'block');
    return div[0];
  }

  function showScoreInformation(playerName, information) {
    var infoPool = infoPools[playerName];

    if (information != '') {
      var arr = information.split(', ');
      for (var i in arr) {
        if (arr[i] == '0') {
          continue;
        }
        infoPool.push(arr[i]);
      }
    }
    if (infoPool.length == 0) return;

    var score = $("#score_info_" + toId(playerName));
    if (score.is(':visible')) {
      return;
    }

    var text = '<center>' + infoPool.join('<br>') + '</center>';
    infoPool.splice(0, infoPool.length);

    var canvas = $("#" + toId(playerName));
    var size = calculateTextSize(text);
    score.css({
      position: "absolute",
      marginLeft: 0,
      marginTop: 0,
      left: canvas.position().left + canvas.width()/2 - size.clientWidth/2,
      top: canvas.position().top + canvas.height()/2 - size.clientHeight/2
    });

    score.html(text);

    score.show().delay(300).fadeOut(1600, function() {
      score.hide();

      showScoreInformation(playerName, '');
    });
  }

  function createCanvas(canvasName) {
    var canvas = $("#" + canvasName);

    var plotSize = 0;
    var canvasSize = 0;
    var firstSprite = null;

    // TODO а обязательно загружать каждый раз все рисунки снова?
    var images = {};
    for (var color in plotsUrls) {
      var image = new Image();
      image.onload = function() {
        if (this == firstSprite) {
          calcSize(this);
        }
      }
      image.src = plotsUrls[color];
      images[color] = image;
      if (!firstSprite) {
        firstSprite = image;
      }
    }

    var drawImage = function(image, x, y, dx, dy) {
      var ctx = canvas[0].getContext("2d");
      ctx.drawImage(
        image,
        x * plotSize - (image.width - plotSize)/2 + dx,
        (boardSize - 1 - y) * plotSize - (image.height - plotSize) + dy
      );
    };

    var drawText = function(text, pt, font, style) {

      if (pt.x == -1 || pt.y == -1) return;

      var ctx = canvas[0].getContext("2d");
      if (!font) {
        font = {
          font: "15px 'Verdana, sans-serif'",
          fillStyle: style || "#0FF",
          textAlign: "left",
          shadowColor: "#000",
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 7
        }
      }
      ctx.font = font.font;
      ctx.fillStyle =  font.fillStyle;
      ctx.textAlign = font.textAlign;
      ctx.shadowColor = font.shadowColor;
      ctx.shadowOffsetX = font.shadowOffsetX;
      ctx.shadowOffsetY = font.shadowOffsetY;
      ctx.shadowBlur = font.shadowBlur;

      var x = (pt.x + 1) * plotSize;
      var y = (boardSize - pt.y - 1) * plotSize - 5;
      if (!!font.dx) {
        x += font.dx;
      }
      if (!!font.dy) {
        y += font.dy;
      }
      for (var i = 0; i < 10; i++) {
        ctx.fillText(text, x, y);
      }
      ctx.shadowBlur = 0;
    }

    var clear = function() {
      canvas.clearCanvas();
    }

    var getCanvasSize = function() {
      return canvasSize;
    }

    var getPlotSize = function() {
      return plotSize;
    }

    return {
      drawImage : drawImage,
      drawPlot : drawPlot,
      drawText: drawText,
      clear : clear,
      getCanvasSize : getCanvasSize,
      getPlotSize : getPlotSize
    };
  }

  function isPlayerListEmpty(data) {
    return Object.keys(data).length == 0;
  }

  function getNames(playerList) {
    var result = [];
    playerList.forEach(function (player) {
      result.push(player.name);
    });
    return result;
  }

  function isPlayersListChanged(data) {
    var newPlayers = Object.keys(data);
    var oldPlayers = getNames(players);

    if (newPlayers.length != oldPlayers.length) {
      return true;
    }

    var hasNew = false;
    newPlayers.forEach(function (newPlayer) {
      if ($.inArray(newPlayer, oldPlayers) == -1) {
        hasNew = true;
      }
    });

    return hasNew;
  }

  function drawUsersCanvas(data) {
    if (data == null) {
      $("#showdata").text("There is NO data for player available!");
      return;
    }
    $("#showdata").text('');

    if (isPlayerListEmpty(data)) {
      goToHomePage();
      return;
    }

    if (allPlayersScreen && isPlayersListChanged(data)) {
      reloadCanvasesData();
      return;
    }

    if (allPlayersScreen) {
      for (var player in data) {
        drawUserCanvas(player, data[player], true);
      }
    } else {
      for (var i in players) {
        var player = players[i].name;
        drawUserCanvas(player, data[player], false);
      }
    }
  }

  function drawUserCanvas(playerName, data, allPlayersScreen) {
    if (currentBoardSize != data.boardSize) {    // TODO так себе решение... Почему у разных юзеров передается размер добры а не всем сразу?
      reloadCanvasesData();
    }

    var canvas = canvases[playerName];
    canvas.boardSize = boardSize;
    drawBoard(getBoardDrawer(canvas, playerName, data, allPlayersScreen));

    $("#score_" + toId(playerName)).text(data.score);

    showScoreInformation(playerName, data.info);

    if (!allPlayersScreen) {
      $("#level_" + toId(playerName)).text(data.heroesData[playerName][playerName].level + 1);
    }
  }

}
*/
