var models = require(__dirname + "/../../models");
var Bookshelf = require('bookshelf').PG;

module.exports = function(req, res) {

  if( req.flash( 'success' )[0] == 'success' ){
    messageLoginSuccess = [{
      alertType: "alert-success",
      strongMessage: 'You succesfully logged in!',
      messageText: '',
      display: true
    }];
  }
  else{
    messageLoginSuccess = null;
  }
  var current_user = req.metaData.current_user
  var displayTuto  = (current_user.logincount == 1 && messageLoginSuccess != null )
  var User = models.User;
  var user = new User({
    id: req.metaData.current_user.id
  })
  logCount = req.metaData.current_user.logincount;
  user.fetch().then( function( current_user ){ //update lastlogin_at
    current_user.save();
    update_time = current_user.get( 'updated_at' );
    current_user.save( { lastlogin_at : update_time , logincount: logCount });
  });
  console.log( current_user.admin )
  if( current_user.admin ){
    var List = models.List;
    var list = new List;

  var Lists = Bookshelf.Collection.extend({
    model: List
  });
  var lists = new Lists().query('where', 'id', '>', 0).fetch().then(function(lists) {
    res.render("user/home", {
      metaData: req.metaData,
      lists: lists.toJSON(),
      message: messageLoginSuccess,
      displayTuto: displayTuto 
    });
  });

 }
  else{
    user.lists().fetch().then(function(lists){

      res.render("user/home", {
        metaData: req.metaData,
        lists: lists.toJSON(),
        message: messageLoginSuccess,
        displayTuto: displayTuto 

      });
    });
  };
}
