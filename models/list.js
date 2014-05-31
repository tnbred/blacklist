module.exports = function(mongoose) {
    // Initialize schema
    var ListSchema = new mongoose.Schema({
      name        : String,
      createdAt   : { type: Date, "default": Date.now },
      updatedAt   : Date
    });


    ListSchema.statics.getListData = function(models, list, metaData, callback) {
    function getRandom(min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    }
    var User = models.User;
    var ListUser = models.ListUser;
    var Vote = models.Vote;
    var results = {}
    var selfId = list._id;
    var selfName = list.name;
    ListUser.find({listId: selfId}, function(error,listusers){
    	User.where('_id').in(listusers.map(function(n,i){return n.userId;})).exec(function(error,users){
    		Vote.where('userId').in(listusers.map(function(n,i){return n.userId;})).exec(function(error,votes){
                var rankArray= User.findRankArray(votes);
                results.totalPeople=users.length;
                results.currentUser_Rank=User.findRank(metaData.current_user._id,rankArray);
                results.currentUser_Points=User.findPoints(metaData.current_user._id,rankArray);
                results.percentage=(results.currentUser_Rank / results.totalPeople) * 100;
                results.listName=selfName;
                results.listId=selfId;
                results.users = [];
                for(var i in users) {
                	var userHash = {}
                	userHash.user=users[i];
                	userHash.votes=Vote.findVotesForUser(users[i]._id,votes);
                	userHash.userRank=User.findRank(users[i]._id,rankArray);
                	userHash.userPoints=User.findPoints(users[i]._id,rankArray);
                	userHash.userPointsLeft=User.getPointsLeft(users[i]._id,votes);
                	results.users.push(userHash);
                }
                results.users.sort(function(a,b) { return b.userPoints-a.userPoints } );
    			callback(null,results);
    		});
    	});
    });
	}
    
    return mongoose.model('List', ListSchema);
};