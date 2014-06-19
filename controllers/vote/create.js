var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
  var voteData = req.param("vote", null);
  var tr_id = req.param("tr_id", null);
  var metaData = req.metaData;

  var Vote = models.Vote
  var User = models.User
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
    try{
      if( vote.toJSON().points > 0 ){
        vote.save().then(function(vote) {
          console.log( vote.toJSON().points);

          var hash = {};
          hash.points = vote.toJSON().points;
          hash.message = "Vote saved! (+" + vote.toJSON().points + ")";
          hash.tr_id = tr_id;
          hash.points_left = pointsLeft;
          res.json(hash);
        });
      }
      else{
        throw "negative and null votes are forbidden!"
      }
    }
    catch(error){
      var hash = {};
      hash.points = vote.toJSON().points;
      hash.message = error;
      hash.tr_id = tr_id;
      hash.points_left = pointsLeft;
      res.json(hash);
    }
  })

};


