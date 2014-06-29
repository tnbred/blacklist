var models = require(__dirname + "/../models");
var config = require(__dirname + "/../config");

module.exports = function(req, res) {
  // Try login
  var email = req.param("email", null);
  var hostname = req.headers.host;

  if (email) {
    new models.User().query('where', 'email', '=', email).fetch().then(function(user) {
      var salt = user.toJSON().salt;
      var mailOptions = {
        to: email,
        generateTextFromHTML: true,
        subject: "Your password",
        html: "get it <a href=\""+hostname+"/reset/"+salt+"\">here</a>"
      }
      config.Mailer.Transport.sendMail(mailOptions);
      res.redirect("/");

    })
  } else {
    res.render(
      "static/sendPassword", {
        metaData: req.metaData
      }
    );
  }

};