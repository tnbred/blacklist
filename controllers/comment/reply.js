var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
  var button_id = req.param("button_id", null)
  if( button_id ){
    var textDisplayReply  = req.param("textDisplayReply", null)
    res.json({button_id: button_id , textDisplayReply: textDisplayReply}); 
  }
  else{
    var replyCommentData = req.param("reply_comment", null);
    var commentId        = replyCommentData.commentId;
    var listId           = replyCommentData.listId;
    var metaData         = req.metaData;
    var ReplyComment     = models.ReplyComment;
    var replyComment     = new ReplyComment({
      reply: replyCommentData.text,
      user_id: metaData.current_user.id,
      comment_id: commentId
    });
    replyComment.save();
    res.redirect("/lists/"+listId ) ;
  }
};