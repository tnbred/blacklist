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


var Render = function(locals) {
	this.locals = locals;
	this.send = function(err, html, text) {
		console.log(this.locals)
		/*config.Mailer.Transport.sendMail({
						from: 'The BlackListApp <no-reply@theblacklistapp.com>',
						to: locals.email,
						subject: 'The BlacklistApp - Your have new points!',
						html: html
					})*/
	};
	this.batch = function(batch) {
		batch(this.locals, this.send);
	};
};


new Users().fetch().then(function(users) {
	emailTemplates(templatesDir, function(err, template) {
		template('newPoints', true, function(err, batch) {
			users = users.toJSON()
			for (var i = 0; i < users.length; i++) {
				var user = users[i]
				var render = new Render({
					name: user.name,
					email: user.email
				});
				render.batch(batch);
			}
		})
	})

})