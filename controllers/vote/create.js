var models = require(__dirname + "/../../models");

module.exports = function(req, res) {
  var vote = req.param("vote",null);
  var tr_id = req.param("tr_id",null);
  var metaData = req.metaData;

  var Vote = models.Vote;
  var vote = new Vote({
        points: vote.points,
        userId: metaData.current_user._id,
        userToId: vote.user_to_id,
        listId: vote.list_id
      });
  vote.save(function(error){
    if(error) res.json(error);
    var hash = {};
    hash.points=vote.points;
    hash.message="Vote saved! (+"+vote.points+")";
    hash.tr_id=tr_id;
    hash.points_left=25;
    res.json(hash);
  });
};