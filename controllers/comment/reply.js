var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
  var replyCommentData = req.param("reply_comment", null);

  var commentId = replyCommentData.commentId;
  var metaData = req.metaData;
  var ReplyComment = models.ReplyComment;
  var replyComment = new ReplyComment({
    reply: replyCommentData.text,
    user_id: metaData.current_user.id,
    comment_id: commentId
  });
  replyComment.save();
  new models.Comment({
    id: commentId,
  }).fetch().then(function( comment ){ 
    res.redirect("/lists/"+comment.get('list_id') ) } );
};

