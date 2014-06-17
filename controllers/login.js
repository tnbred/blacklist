var models = require(__dirname + "/../models");
var validation = require( __dirname + '/validations/loginValidation')

module.exports = function(req, res) {
      res.render(
        "static/login", {
          metaData: req.metaData
        }
      );
    }
