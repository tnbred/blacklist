module.exports = function(req, res) {
  req.logout()
  req.session.signout = true,
  res.redirect("/")
};


