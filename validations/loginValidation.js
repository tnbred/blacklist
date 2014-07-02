function checkLoginInfo(errorMessage) {
  if (errorMessage) {
    return [{
      alertType: "alert-danger",
      strongMessage: "Error!",
      messageText: errorMessage,
      display: true
    }]
  } else {
    return null
  }
}

exports.checkLoginInfo = checkLoginInfo;