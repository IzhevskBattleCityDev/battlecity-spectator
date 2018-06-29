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
}

export default new Helpers()
