var models = require(__dirname + "/../models")
var config = require(__dirname + "/../config")
var path = require('path')
var templatesDir = path.join(__dirname, '/../views/mail/templates')
var emailTemplates = require('email-templates');

module.exports = function(req, res) {
  // Try login
  var email = req.param("email", null);
  var hostname = req.headers.host;

  if (email) {
    new models.User().query('where', 'email', '=', email).fetch().then(function(user) {
      if( user == null ){
        message= [{
          alertType: "alert-danger",
          strongMessage: "Email invalid!",
          messageText: "We did not find you in our database...",
          display: true
        }];
        res.render(
          "static/sendPassword", {
            metaData: req.metaData,
            message: message
          });
      }
      else{
        var salt = user.toJSON().salt;
        emailTemplates(templatesDir, function(err, template) {
          var locals = {
            email: email,
            salt: salt,
            hostname: hostname,
            name: {
              first: user.toJSON().firstname,
              last: user.toJSON().lastname
            }
          }

          template('resetPassword', locals, function(err, html, text) {
            config.Mailer.Transport.sendMail({
              from: 'The BlackListApp <no-reply@theblacklistapp.com>',
              to: locals.email,
              subject: 'The BlacklistApp - Reset your password',
              html: html
            })
          })
        })

        message = [{
          alertType: 'alert-success',
          strongMessage: 'Email valid!',
          messageText: 'We just sent you an email to reset your password',
          display: true
        }];
        res.render("static/login" , {
          metaData: req.metaData,
          message : message  
        });
      }
    })
  } else {
    message = [{
      alertType: 'alert-danger',
      strongMessage: 'Email invalid!',
      messageText: '',
      display: true
    }];
    res.render(
      "static/sendPassword", {
        metaData: req.metaData
      });
  }
};
