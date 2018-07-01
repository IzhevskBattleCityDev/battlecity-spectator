export default class BoardDrawer {
  playerName = ''
  playerData = {}
  canvas = null
  allPlayersScreen = false

  constructor (canvas, playerName, playerData, allPlayersScreen) {
    this.playerName = playerName
    this.playerData = playerData
    this.canvas = canvas
    this.allPlayersScreen = allPlayersScreen
  }

  getBoard () {
    return this.playerData.board
  }

  getHeroesData (isAll) {
    if (isAll) {
      var result = {}
      for (var name in this.playerData.heroesData) {
        result[name] = this.playerData.heroesData[name][name]
      }
      return result
    } else {
      return this.playerData.heroesData[this.playerName]
    }
  }

  drawAllLayers (layers, onDrawItem) {
    var isDrawByOrder = true
    var drawChar = function (plotIndex) {
      var x = 0
      var y = this.boardSize - 1
      for (var charIndex in layers[0]) {
        for (var layerIndex in layers) {
          var layer = layers[layerIndex]
          var color = layer[charIndex]
          if (!isDrawByOrder || plotIndex == color) {
            this.canvas.drawPlot(this.decode(color), x, y)
            if (!!onDrawItem) {
              this.onDrawItem(layers, layerIndex, charIndex, x, y)
            }
          }
        }
        x++
        if (x == boardSize) {
          x = 0
          y--
        }
      }
    }

    if (isDrawByOrder) {
      for (var char in this.plots) {
        // var plot = this.plots[char];
        drawChar(char)
      }
    } else {
      drawChar()
    }
  }

  drawBackground (name) {
    if (this.plotsContains(name)) {
      var x = this.boardSize / 2 - 0.5
      this.canvas.drawPlot(name, x, 0)
    }
  }

  drawBack () {
    this.drawBackground('background')
  }

  drawFog () {
    this.drawBackground('fog')
  }

  clear () {
    this.canvas.clear()
  }

  drawLayers (onDrawItem) {
    var board = this.getBoard()
    try {
      this.drawAllLayers(board.layers, onDrawItem)
    } catch (err) {
      try {
        this.drawAllLayers([board], onDrawItem)
      } catch (err) {
        console.log(err)
      }
    }
  }

  drawPlayerNames (font, beforeDraw) {
    try {
      var drawName = function(name, point, font, heroData, isHero) {
        var name = Helpers.getNameFromEmail(name)
        var data = {
          'name':name,
          'point':point,
          'font':font,
          'heroData':heroData
        }
        if (!!beforeDraw) data = this.beforeDraw(data)
        this.canvas.drawText(data.name, data.point, data.font, isHero === true ? '#FFFB00' : null);
      }

      var board = this.getBoard();
      if (this.singleBoardGame || !!board.showName) {
        var currentPoint = null
        var currentHeroData = null
        var heroesData = this.getHeroesData(this.singleBoardGame)
        for (var name in heroesData) {
          var heroData = heroesData[name]
          var point = heroData.coordinate
          if (!point) return // TODO why this can happen?
          if (point.x === -1 || point.y === -1) return
          if (!!board.offset) {
            point.x -= board.offset.x
            point.y -= board.offset.y
          }
          if (this.playerName === name) {
            currentPoint = point
            currentHeroData = heroData
          }
          if (!board.onlyMyName && !!heroData.singleBoardGame) {
            this.drawName(name, point, font, heroData, this.playerName === name)
          }
        }
        drawName(this.playerName, currentPoint, font, currentHeroData, true)
      }
    } catch (err) {
      console.log(err)
    }
  }
}
