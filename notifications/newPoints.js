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


var User = models.User
var Users = Bookshelf.Collection.extend({
	model: User
});

new Users().fetch().then(function(users) {
	users = users.toJSON()
	emailTemplates(templatesDir, function(err, template) {
		for (var i = 0; i < users.length; i++) {
			var user = users[i]
			var locals = {
				name: user.name
			}
			template('newPoints', locals, function(err, html, text) {
				config.Mailer.Transport.sendMail({
					from: 'The BlackListApp <no-reply@theblacklistapp.com>',
					to:  "tnbredillet@gmail.com",
					subject: 'The BlacklistApp - Your have new points!',
					html: html
				})
			})

		}
		setTimeout(function() {
			process.exit(0)
		}, 5000)
	})


})