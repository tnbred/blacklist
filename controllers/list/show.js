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
		commentsSorted = list.related("comments").toJSON().sort(function(a, b) {
			return b.created_at.getTime() - a.created_at.getTime()
		});
		res.render("list/show", {
			metaData: req.metaData,
			list: list.toJSON(),
			comments: commentsSorted
		});
	})
};