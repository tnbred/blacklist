var Bookshelf = require('bookshelf')
var config = require(__dirname + "/../config");
Bookshelf.PG = Bookshelf.initialize({
	client: 'pg',
	connection: config.PG.PG_URL
});
var Bookshelf = require('bookshelf').PG;
var models = require(__dirname + "/../models")


var path = require('path')
var templatesDir = path.join(__dirname, '/../views/mail/templates')
var emailTemplates = require('email-templates');


var List = models.List
var User = models.User
var Vote = models.Vote
var Lists = Bookshelf.Collection.extend({
	model: List
});



emailTemplates(templatesDir, function(err, template) {
	var Render = function(locals) {
		this.locals = locals
		var locals = locals
		this.send = function(err, html, text) {
			if (err) {
				console.log(err);
			} else {
				config.Mailer.Transport.sendMail({
					from: 'The BlackListApp <no-reply@theblacklistapp.com>',
					to: locals.email,
					subject: 'The BlacklistApp - Your have leftover points!',
					html: html,
					// generateTextFromHTML: true,
					text: text
				}, function(err, responseStatus) {
					if (err) {
						console.log(err);
					} else {
						console.log(responseStatus.message);
					}
				});
			}
		};
		this.batch = function(batch) {
			batch(this.locals, templatesDir, this.send);
		};
	};

	template('pointsRemaining', true, function(err, batch) {
		new Lists().fetch({
			withRelated: ['users', 'votes']
		}).then(function(lists) {
			lists = lists.models
			for (var i = 0; i < lists.length; i++) {
				var list = lists[i]
				var users = list.related("users").toJSON()
				var votes = list.related("votes").toJSON()
				list = list.toJSON()
				for (var j = 0; j < users.length; j++) {
					var user = users[j]
					var pointsLeft = new User().getPointsLeft(user.id, votes)
					if (pointsLeft > 0) {
						var emailLocals = {
							points: pointsLeft,
							list: list.name,
							email: user.email,
							name: user.name
						}
						var render = new Render(emailLocals);
						render.batch(batch);
					}
				}
			}
		})

	});
})
