<template>
  <div>
  <canvas :id="id" ref="board" v-on:mousedown="handleMouseDown" v-on:mouseup="handleMouseUp" v-on:mousemove="handleMouseMove"></canvas>
  </div>
</template>

<script>
  import Helpers from '@/classes/helpers'
  export default {
    props: [
      'id',
      'data'
    ],
    data: function () {
      return {
        mouse: {
          current: {
            x: 0,
            y: 0
          },
          previous: {
            x: 0,
            y: 0
          },
          down: false
        },
        plotSize: 0,
        canvasSize: 0,
        firstSprite: null,
        screen: ''
      }
    },
    computed: {
      currentMouse: function () {
        var ctx = this.canvas
        var rect = ctx.getBoundingClientRect()
        return {
          x: this.mouse.current.x - rect.left,
          y: this.mouse.current.y - rect.top
        }
      },
      plots: function () {
        return this.data.plots
      },
      boardSize: function () {
        return this.data.data.boardSize
      },
      images: function () {
        return this.data.images
      },
      canvas: function () {
        return this.$refs.board.getContext('2d')
      },
      board: function () {
        return this.data.data.board
      },
      currentPlayer: function () {
        return this.$game.currentPlayer
      },
      singleBoardGame: function () {
        return this.$game.boards.singleBoardGame
      }
    },
    created: function () {
      this.$events.$on('board:update', this.handleUpdate)
    },
    methods: {
      handleUpdate () {
        this.clear()
        this.drawBack()
        this.drawLayers()
        this.drawPlayerNames()
        this.drawFog()
      },

      drawAllLayers (layers, onDrawItem) {
        var isDrawByOrder = true
        var drawChar = function (plotIndex) {
          var x = 0
          var y = this.boardSize - 1
          for (var charIndex in layers[0]) {
            for (var layerIndex in layers) {
              var layer = layers[layerIndex]
              var color = layer[charIndex]
              if (!isDrawByOrder || plotIndex === color) {
                this.drawPlot(this._decode(color), x, y)
                if (color === 'A') {
                  // console.log('Bomberman:', x, y)
                  // console.log('Screen:', layers === this.screen)
                }
                if (typeof onDrawItem === 'function') {
                  this.onDrawItem(layers, layerIndex, charIndex, x, y)
                }
              }
            }
            x++
            if (x === this.boardSize) {
              x = 0
              y--
            }
          }
        }

        if (isDrawByOrder) {
          for (var char in this.plots) {
            // var plot = this.plots[char];
            drawChar.call(this, char)
          }
        } else {
          drawChar().call(this)
        }
      },
      getHeroesData (isAll, playerName) {
        if (isAll) {
          var result = {}
          for (var name in this.data.data.heroesData) {
            result[name] = this.data.data.heroesData[name][name]
          }
          return result
        } else {
          return this.data.data.heroesData[playerName]
        }
      },
      drawText (text, pt, font, style) {
        if (pt.x === -1 || pt.y === -1) return
        var ctx = this.canvas
        if (!font) {
          font = {
            font: "15px 'Verdana, sans-serif'",
            fillStyle: style || '#0FF',
            textAlign: 'left',
            shadowColor: '#000',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 7
          }
        }
        ctx.font = font.font
        ctx.fillStyle = font.fillStyle
        ctx.textAlign = font.textAlign
        ctx.shadowColor = font.shadowColor
        ctx.shadowOffsetX = font.shadowOffsetX
        ctx.shadowOffsetY = font.shadowOffsetY
        ctx.shadowBlur = font.shadowBlur
        var x = (pt.x + 1) * this.data.plotSize
        var y = (this.boardSize - pt.y - 1) * this.data.plotSize - 5
        var _text = ctx.measureText(text)
        font.dx = -1 * _text.width / 2
        if ('dx' in font) {
          x += font.dx
        }
        if ('dy' in font) {
          y += font.dy
        }
        for (var i = 0; i < 10; i++) {
          ctx.fillText(text, x, y)
        }
        ctx.shadowBlur = 0
      },
      drawPlayerNames (font, beforeDraw) {
        try {
          var drawName = function (name, point, font, heroData, isHero) {
            let data = {
              name: name,
              point: point,
              font: font
            }
            if (typeof beforeDraw === 'function') data = beforeDraw(data)
            this.drawText(data.name + Helpers.getAdditionalPlayerDataToRender(heroData), data.point, data.font, isHero === true ? '#FFFB00' : null)
          }
          var board = this.data.data
          let playerName = this.currentPlayer
          if (this.singleBoardGame || !!board.showName) {
            var currentPoint = null
            var currentHeroData = null
            var heroesData = this.getHeroesData(this.singleBoardGame, playerName)
            for (var name in heroesData) {
              var heroData = heroesData[name]
              var point = heroData.coordinate
              if (!point) return // TODO why this can happen?
              if (point.x === -1 || point.y === -1) return
              if ('offset' in board) {
                point.x -= board.offset.x
                point.y -= board.offset.y
              }
              if (playerName === name) {
                currentPoint = point
                currentHeroData = heroData
              }
              if (!board.onlyMyName && !!heroData.singleBoardGame) {
                drawName.call(this, Helpers.getNameFromEmail(name), point, font, heroData, playerName === name)
              }
            }
            drawName.call(this, Helpers.getNameFromEmail(playerName), currentPoint, font, currentHeroData, true)
          }
        } catch (err) {
          console.log(err)
        }
      },

      drawBackground (name) {
        if (this.plotsContains(name)) {
          var x = this.boardSize / 2 - 0.5
          this.drawPlot(name, x, 0)
        }
      },
      plotsContains (color) {
        for (var char in this.plots) {
          if (this.plots[char] === color) {
            return true
          }
        }
        return false
      },
      drawBack () {
        this.drawBackground('background')
      },
      drawFog () {
        this.drawBackground('fog')
      },
      clear () {
        let canvasSize = this.data.plotSize * this.boardSize
        if (this.$refs.board.width !== canvasSize || this.$refs.board.height !== canvasSize) {
          this.$refs.board.width = canvasSize
          this.$refs.board.height = canvasSize
        }
        this.canvas.clearRect(0, 0, canvasSize, canvasSize)
      },
      drawLayers (onDrawItem) {
        try {
          this.drawAllLayers(this.board.layers, onDrawItem)
          this.data.data.board = ''
        } catch (err) {
          try {
            this.drawAllLayers([this.board], onDrawItem)
            this.data.data.board = ''
          } catch (err) {
            console.log(err)
            this.data.data.board = ''
          }
        }
      },
      _decode (char) {
        return this.plots[char]
      },
      drawPlot: function (color, x, y) {
        var image = this.images[color]
        this.drawImage(image, x, y, 0, 0)
      },
      drawImage: function (image, x, y, dx, dy) {
        this.canvas.drawImage(
          image,
          x * this.data.plotSize - (image.width - this.data.plotSize) / 2 + dx,
          (this.boardSize - 1 - y) * this.data.plotSize - (image.height - this.data.plotSize) + dy
        )
      },
      loadImages: function () {
        for (var color in this.$game.board.plotsUrls) {
          var image = new Image()
          image.onload = function () {
            if (this === this.firstSprite) {
              this.calcSize(this)
            }
          }
          image.src = this.$game.board.plotsUrls[color]
          this.images[color] = image
          if (!this.firstSprite) {
            this.firstSprite = image
          }
        }
      },
      draw: function (event) {
        // requestAnimationFrame(this.draw);
        if (this.mouse.down) {
          var ctx = this.canvas
          ctx.clearRect(0, 0, 800, 800)
          ctx.lineTo(this.currentMouse.x, this.currentMouse.y)
          ctx.strokeStyle = '#F63E02'
          ctx.lineWidth = 2
          ctx.stroke()
        }
      },
      handleMouseDown: function (event) {
        this.mouse.down = true
        this.mouse.current = {
          x: event.pageX,
          y: event.pageY
        }
        var ctx = this.canvas
        ctx.moveTo(this.currentMouse.x, this.currentMouse.y)
      },
      handleMouseUp: function () {
        this.mouse.down = false
      },
      handleMouseMove: function (event) {
        this.mouse.current = {
          x: event.pageX,
          y: event.pageY
        }
        this.draw(event)
      }
    },
    ready: function () {
      var ctx = this.canvas
      ctx.translate(0.5, 0.5)
      ctx.imageSmoothingEnabled = false
      // this.draw();
    },
    name: 'Board'
  }
</script>
