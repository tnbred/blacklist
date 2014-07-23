var models = require(__dirname + "/../../models");

module.exports = function(req, res) {

	var List = models.List;
	var listId = req.param('id', null);
	var metaData = req.metaData;



	new List({
		id: listId
	}).fetch({
		withRelated: ['comments', 'comments.user', 'comments.likes' , 'comments.list' , 'comments.replies' , 'comments.replies.user' ]
	}).then(function(list) {
		commentsSorted = list.related("comments").toJSON().sort(function(a, b) {
			return b.created_at.getTime() - a.created_at.getTime()
		});
		for (var i = 0; i < commentsSorted.length; i++) {
			var disabled=""
			for (var j = 0; j < commentsSorted[i].likes.length; j++) {
				if(commentsSorted[i].likes[j].user_id==metaData.current_user.id) {
					disabled="disabled";
				}
			};
			commentsSorted[i].likes     = commentsSorted[i].likes.length
			commentsSorted[i].disabled = disabled
			commentsSorted[i].repliesLength = commentsSorted[i].replies.length
			if( commentsSorted[i].replies.length>1 ){
				commentsSorted[i].textDisplayReply = 'Click to see the '+commentsSorted[i].replies.length+' replies';
			}
			else{
				commentsSorted[i].textDisplayReply = 'Click to see the reply';
			};

		};
		res.render("list/show", {
			metaData: req.metaData,
			list: list.toJSON(),
			comments: commentsSorted,
		});
	})
};