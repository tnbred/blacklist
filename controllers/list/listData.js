var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
    var List = models.List;
    var listId = req.param('listId',null);
    var layout = req.param("layout",null);
    var metaData = req.metaData;
    List.find({_id: listId}, function(error,list){
      List.getListData(models, list[0], metaData, function(error,results){
      	 if(layout){
      	   res.render("list/_list", {layout:false, metaData: req.metaData, results: results});
      	 } else {
           res.render("list/_list_home", {layout:false, metaData: req.metaData, results: results});
         }
     });
    });
};