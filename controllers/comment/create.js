var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
  var commentData = req.param("comment", null);
  var metaData = req.metaData;
  var Comment = models.Comment;

  var comment = new Comment({
    comment: commentData.text,
    user_id: metaData.current_user.id,
    list_id: commentData.listId
  });
  comment.save()

  res.redirect("/lists/" + commentData.listId);

};