module.exports = function(mongoose) {
    // Initialize schema
    var CommentSchema = new mongoose.Schema({
      listId      : mongoose.Schema.Types.ObjectId,
      userId      : mongoose.Schema.Types.ObjectId,
      comment     : String,
      createdAt   : { type: Date, "default": Date.now },
      updatedAt   : Date
    });

    // Indexes:
    // Email is considered as a unique identifier
    CommentSchema.index({ listId: 1, userId: -1 })

    
    return mongoose.model('Comment', CommentSchema);
};