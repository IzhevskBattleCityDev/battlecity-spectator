<template>
  <canvas :id="id" ref="screen" v-on:mousedown="handleMouseDown" v-on:mouseup="handleMouseUp" v-on:mousemove="handleMouseMove"></canvas>
</template>

<script>
  export default {
    props: ['id'],
    data: function () {
      return {
        boards: [],
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
        images: {}
      }
    },
    computed: {
      currentMouse: function () {
        var c = document.getElementById('screen')
        var rect = c.getBoundingClientRect()
        return {
          x: this.mouse.current.x - rect.left,
          y: this.mouse.current.y - rect.top
        }
      }
    },
    mounted: function () {
      //
    },
    created: function () {
      // this.$event.$on('board:build', this.build)
      // this.loadImages()
    },
    methods: {
      calcSize: function (image) {
        this.plotSize = image.width
        this.canvasSize = this.plotSize * this.$game.board.boardSize
        if (this.$refs.screen.width !== this.canvasSize || this.$refs.screen.height !== this.canvasSize) {
          this.$refs.screen.width = this.canvasSize
          this.$refs.screen.height = this.canvasSize
        }
      },
      drawPlot: function (color, x, y) {
        var image = this.images[color]
        this.drawImage(image, x, y, 0, 0)
      },
      drawImage: function (image, x, y, dx, dy) {
        var ctx = this.$refs.screen.getContext('2d')
        ctx.drawImage(
          image,
          x * this.plotSize - (image.width - this.plotSize) / 2 + dx,
          (this.$game.board.boardSize - 1 - y) * this.plotSize - (image.height - this.plotSize) + dy
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
          var c = document.getElementById('screen')
          var ctx = c.getContext('2d')
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
        var c = document.getElementById('screen')
        var ctx = c.getContext('2d')
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
      var c = document.getElementById('screen')
      var ctx = c.getContext('2d')
      ctx.translate(0.5, 0.5)
      ctx.imageSmoothingEnabled = false
      // this.draw();
    },
    name: 'Board'
  }
</script>
