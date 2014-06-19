var models = require(__dirname + "/../../models");
module.exports = function(req, res) {
  var current_user = req.metaData.current_user
  var User = models.User;
  var user = new User(current_user)
  
  user.lists().fetch().then(function(lists){
    res.render("user/home", {
        metaData: req.metaData,
        lists: lists.toJSON()
      });
  })
};