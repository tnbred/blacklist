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

emailTemplates(templatesDir, function(err, template) {
    var Render = function(locals) {
      this.locals = locals;
      var locals = locals
      this.send = function(err, html, text) {
        if (err) {
          console.log(err);
        } else {

          config.Mailer.Transport.sendMail({
						from: 'The BlackListApp <no-reply@theblacklistapp.com>',
						to: locals.email,
            subject: 'The BlacklistApp - Your have new points!',
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

    template('newPoints', true, function(err, batch) {
      new Users().fetch().then(function(users) {
        users = users.toJSON()
         for(var user in users) {
        var render = new Render(users[user]);
        render.batch(batch);
      }
      })
     
    });
  })

setTimeout(function(){ process.exit(0);  }, 3000000);