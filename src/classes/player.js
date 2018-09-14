export default class Player {
  id = 0
  name = ''
  email = ''
  nick = ''
  score = 0
  life = 0
  ammo = 0

  constructor (info) {
    this.id = info.id
    this.name = info.name
    this.email = info.email
    this.nick = info.nick
    this.score = info.score
    this.life = info.life
    this.ammo = info.ammo
  }
}
