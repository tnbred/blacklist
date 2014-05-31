module.exports = function(mongoose) {
    // Initialize schema
    var ListUserSchema = new mongoose.Schema({
      listId      : { type: mongoose.Schema.Types.ObjectId, index: true},
      userId      : { type: mongoose.Schema.Types.ObjectId, index: true},
      createdAt   : { type: Date, "default": Date.now },
      updatedAt   : Date
    });
    
    return mongoose.model('ListUser', ListUserSchema);
};