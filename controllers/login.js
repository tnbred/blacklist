var models = require(__dirname + "/../models");

module.exports = function(req, res) {
      res.render(
        "static/login", {
          metaData: req.metaData
        }
      );
    }
