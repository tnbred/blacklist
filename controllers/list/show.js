var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
	var List = models.List;
	var listId = req.param('id', null);
	var metaData = req.metaData;

	new List({
		id: listId
	}).fetch({
		withRelated: ['comments', 'comments.user']
	}).then(function(list) {
		res.render("list/show", {metaData: req.metaData, list: list.toJSON(), comments: list.related("comments").toJSON()});
	})
};