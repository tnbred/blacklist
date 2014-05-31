var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
    var List = models.List;
    var listId = req.param('id',null);
    var metaData = req.metaData;
    List.find({_id: listId}, function(error,list){
      res.render("list/show", {metaData: req.metaData, list: list[0]});
    });
};