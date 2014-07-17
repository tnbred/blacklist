var models = require(__dirname + "/../../models");
var path = require('path')
var templatesDir = path.join(__dirname, '/../../views/mail/templates')
var emailTemplates = require('email-templates');
var config = require(__dirname + "/../../config");

module.exports = function(req, res) {
  var voteData = req.param("vote", null);
  var tr_id = req.param("tr_id", null);
  var metaData = req.metaData;

  var Vote = models.Vote
  var User = models.User
  var List = models.List
  var user = new User()
  var qb = new Vote().query()

  qb.where("list_id", "=", voteData.list_id).
  andWhere("user_id", "=", metaData.current_user.id)
    .select()
    .then(function(votes) {
      var pointsLeft = user.getPointsLeft(metaData.current_user.id, votes)
      var vote = new Vote({
        points: parseInt(voteData.points),
        user_id: parseInt(metaData.current_user.id),
        user_to_id: parseInt(voteData.user_to_id),
        list_id: parseInt(voteData.list_id)
      });
      try {
        if (vote.toJSON().points > 0) {
          new User({id:voteData.user_to_id}).fetch().then(function(votedUser) {
            new List({id:voteData.list_id}).fetch().then(function(list) {
              emailTemplates(templatesDir, function(err, template) {
              var locals = {
                listName:list.toJSON().name,
                points:voteData.points,
                name:votedUser.toJSON().name
              }

              template('voteNotification', locals, function(err, html, text) {
                config.Mailer.Transport.sendMail({
                  from: 'The BlacklistApp <theblacklistap@gmail.com>',
                  to: votedUser.toJSON().email,
                  subject: 'The BlacklistApp - You got up voted !',
                  html: html
                })
              })
            })
            })
          })
          vote.save().then(function(vote) {
            var hash = {};
            hash.points = vote.toJSON().points;
            hash.message = "Vote saved! (+" + vote.toJSON().points + ")";
            hash.tr_id = tr_id;
            hash.points_left = pointsLeft;
            hash.error = false;
            res.json(hash);
          });
        } else {
          throw "negative and null votes are forbidden!"
        }
      } catch (error) {
        var hash = {};
        hash.points = vote.toJSON().points;
        hash.message = error;
        hash.tr_id = tr_id;
        hash.points_left = pointsLeft;
        hash.error = true;
        res.json(hash);
      }
    })

};