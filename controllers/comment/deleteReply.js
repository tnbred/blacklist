var models = require(__dirname + "/../../models");
var ReplyComment = models.ReplyComment;

module.exports = function(req, res) {

  var reply_id        = req.param( "reply_id" , null ) 
  var current_user_id = req.metaData.current_user.id
  new ReplyComment ({id: reply_id})
  .fetch()
  .then(function( reply ) {
    console.log( current_user_id );
    var author_id = reply.toJSON().user_id;
    if( current_user_id == author_id ){
      reply.destroy();
    }
  });
};
