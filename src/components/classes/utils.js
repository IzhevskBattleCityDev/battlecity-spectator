/**
 * Created by Denis_Pankratov on 2/24/2018.
 */
export default class Utils {

  getNameFromEmail(email) {
    return email.substring(0, email.indexOf('@'));
  }

}
