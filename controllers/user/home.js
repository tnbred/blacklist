var models = require(__dirname + "/../../models");
var Promise = require('promise');

module.exports = function(req, res) {
	var ListUser = models.ListUser;
    var User = models.User;
    var List = models.List;
    var Vote = models.Vote;


 
   ListUser.find({userId: req.metaData.current_user._id}, function(error,listusers){
     var listIds = [];
     for (var i =0 ; i<listusers.length; i++) {
       listIds.push(listusers[i].listId);
     } 
     List.where('_id').in(listIds).exec(function(error,lists){
       res.render("user/home", {metaData: req.metaData, lists: lists});
      });
    });
};