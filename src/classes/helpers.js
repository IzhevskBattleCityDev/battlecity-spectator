/**
 * Created by Denis_Pankratov on 2/24/2018.
 */
export default class Helpers {

  getNameFromEmail(email) {
    return email.substring(0, email.indexOf('@'));
  }

}
