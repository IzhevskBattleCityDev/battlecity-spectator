export default class Board {
  id = null
  data = null
  plots = null
  images = null

  constructor (id, data, plots, plotSize, images) {
    this.id = id
    this.data = data
    this.plots = plots
    this.plotSize = plotSize
    this.images = images // TODO: возможно, изображения стоит загружать каждой доске, чтобы можно было на одной площадке загружать разные доски
    console.log('new board', data)
  }

  update (data) {
    this.data = data
  }
}
