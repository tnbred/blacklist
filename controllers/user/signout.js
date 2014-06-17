module.exports = function(req, res) {
  req.logout()
  res.redirect("/?success=sign-out-successfull")
};