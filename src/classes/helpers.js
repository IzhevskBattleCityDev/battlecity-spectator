/**
 * Created by Denis_Pankratov on 2/24/2018.
 */

class Helpers {
  getNameFromEmail (email) {
    return email.substring(0, email.indexOf('@'))
  }
  toIdFromEmail (email) {
    return email.replace(/[@.]/gi, '_')
  }
  getIdfromEmail (email) {
    return email.replace(/[@.]/gi, '_')
  }
  getAdditionalPlayerDataToRender (heroData) {
    let data = heroData.additionalData
    return '(' + data.life + '_' + data.ammo + ')'
  }
  normalizeHeroesData (heroesData) {
    var result = {}
    for (var name in heroesData) {
      result[name] = heroesData[name][name]
    }
    return result
  }
}

export default new Helpers()
