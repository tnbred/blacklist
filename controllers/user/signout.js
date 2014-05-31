module.exports = function(req, res) {
  req.session.user=null;
  res.redirect("/?success=sign-out-successfull");
};