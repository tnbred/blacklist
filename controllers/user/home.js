var models = require(__dirname + "/../../models");
module.exports = function(req, res) {
  //console.log(  'req.flash( \'success\' ) !==[]' +(req.flash( 'success' ) !==[])   );
  //console.log(  'req.flash( \'success\' ) !=[]' +(req.flash( 'success' ) !=[])   );
  //console.log(  '!(req.flash( \'success\' ) ==[])' +!((req.flash( 'success' ) ==[]))   );
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
  user.lists().fetch().then(function(lists){

    res.render("user/home", {
      metaData: req.metaData,
      lists: lists.toJSON(),
      message: messageLoginSuccess
    });
  });


};
