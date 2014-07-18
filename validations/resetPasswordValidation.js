checkPostedParameters = function( sentUser ){
  var newPassword = sentUser["password"];
  var newPasswordConfirmation = sentUser["password_confirmation"]
  if (!(newPassword && newPasswordConfirmation)) throw "You have to fill all the required inputs";
  if (newPassword !== newPasswordConfirmation) throw "Password doesn't match password confirmation";
} 
   

exports.checkPostedParameters = checkPostedParameters;