var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
  var replyCommentData = req.param("reply_comment", null);
  var commentId = req.param;
  var metaData = req.metaData;
  var ReplyComment = models.ReplyComment;
  console.log( replyCommentData)
  console.log( req )
  var replyComment = new ReplyComment({
    replyComment: replyCommentData.text,
    user_id: metaData.current_user.id,
    comment_id: replyCommentData.commentId
  });
  //console.log(replyComment);
  //replyComment.save()
  res.redirect("/lists/1");

};