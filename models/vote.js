module.exports = function(mongoose) {
    // Initialize schema
    var VoteSchema = new mongoose.Schema({
      points       : Number,
      userId      : mongoose.Schema.Types.ObjectId,
      userToId    : mongoose.Schema.Types.ObjectId,
      listId      : mongoose.Schema.Types.ObjectId,
      comment     : String,
      createdAt   : { type: Date, "default": Date.now },
      updatedAt   : Date
    });

    VoteSchema.statics.findVotesForUser = function(userId,votes) {
      var result=[];
      for(var i in votes){
        var toCompate=votes[i].userId+""
        if(toCompate==userId){
          result.push(votes[i]);
        }
      }
      return result;
    }
    
    return mongoose.model('Vote', VoteSchema);
};