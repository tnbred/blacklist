var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
  var voteData = req.param("vote",null);
  var tr_id = req.param("tr_id",null);
  var metaData = req.metaData;
   
  var Vote = models.Vote;
  var User = models.User;

  Vote.find({listId: voteData.list_id,userId : metaData.current_user._id}, function(error,votes){
  var pointsLeft = User.getPointsLeft(metaData.current_user._id,votes)
  console.log(pointsLeft)
  var vote = new Vote({
        points: voteData.points,
        userId: metaData.current_user._id,
        userToId: voteData.user_to_id,
        listId: voteData.list_id
      });
  vote.save(function(error){
    if(error) res.json(error);
    var hash = {};
    hash.points=vote.points;
    hash.message="Vote saved! (+"+vote.points+")";
    hash.tr_id=tr_id;
    hash.points_left=pointsLeft;
    res.json(hash);
  });
  })
 
};