

var models       = require(__dirname + "/../../models");
var Comment      = models.Comment;

module.exports = function(req, res) {

  var comment_id      = req.param( "comment_id" , null ) 
  var current_user_id = req.metaData.current_user.id

  Comment.forge({id: comment_id}).fetch({
    withRelated:['replies' , 'likes']
  }).then(function (item) {
    return item.related('replies').invokeThen('destroy').then(function () {
      return item.related('likes').invokeThen('destroy').then(function () {
        return item.destroy();
      });
    });
  });

  res.json({comment_id: comment_id}); 

};

