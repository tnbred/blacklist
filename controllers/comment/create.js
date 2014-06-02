var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
  var commentData = req.param("comment",null);
  var metaData = req.metaData;

   
  var Comment = models.Comment;

  var comment = new Comment({
        comment : commentData.text,
        nickName: metaData.current_user.nickName,
        userId  : metaData.current_user._id,
        listId  : commentData.listId
      });
  comment.save()

  res.redirect("/lists/"+commentData.listId);
 
};