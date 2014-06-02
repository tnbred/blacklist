var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
    var List = models.List;
    var Comment = models.Comment;
    var listId = req.param('id',null);
    var metaData = req.metaData;

    List.find({_id: listId}, function(error,list){
      Comment.find({listId: listId}).sort('-createdAt').exec(function(error, comments){
        res.render("list/show", {metaData: req.metaData, list: list[0], comments: comments});
      });
    });
};