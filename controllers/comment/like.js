var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
  var comment_id = req.param("comment_id", null)
  var button_id = req.param("button_id", null)
  var likes = parseInt(req.param("likes", null))
  var metaData = req.metaData
  var current_user_id = metaData.current_user.id
  
  var CommentLike = models.CommentLike;

  var commentLike = new CommentLike({
    comment_id: comment_id,
    user_id: current_user_id
  });
  commentLike.save()

  likes=likes+1

  res.json({button_id: button_id, likes:likes});
};