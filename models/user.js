module.exports = function(mongoose) {
    // Initialize schema
    var UserSchema = new mongoose.Schema({
      email       : String,
      password    : String,
      approved    : Boolean,
      salt        : String,
      createdAt   : { type: Date, "default": Date.now },
      updatedAt   : Date,
      lastLoginAt : Date
    });

    // Indexes:
    // Email is considered as a unique identifier
    UserSchema.index({ email: 1 }, { unique: true });

    // Model functions
    /**
     * Generates a random SHA-1 hash.
     * 
     * @param  {Function} callback 
     * @return {Void}            
     */
    UserSchema.methods.generateSalt = function(callback) {
      var Crypto = require("crypto"),
          hash   = Crypto.createHash("sha1");

      Crypto.randomBytes(256, function(error, buffer) {
        try {
          if (error) {
            throw error;
          }
          else {
            hash.update(buffer);
            callback(null, hash.digest("hex"));
          }
        }
        catch (_error) {
          callback(_error, null);
        }
      });
    };

    /**
     * Returns an ASCII-swapped version of the input string.
     * 
     * @param  {String} stringValue 
     * @return {String}             
     */
    UserSchema.methods.swapString = function(stringValue) {
      return stringValue.split('').map(function(character) {
        return String.fromCharCode(255-character.charCodeAt(0));
      }).join('');
    };

    /**
     * Gets a salted version of a password.
     * 
     * @param  {String} password 
     * @param  {String} salt     
     * @return {String}
     * @throws {Error}          
     */
    UserSchema.methods.getSaltedPassword = function(password, salt) {
      // Initialize
      var Crypto  = require("crypto"),
          hash    = Crypto.createHash("sha1");

      // Update the hash
      hash.update(
        [this.swapString(salt), password, salt].join('')
      );

      // Digest
      return hash.digest("hex");
    };

    /**
     * Salt the password of the current user instance.
     * 
     * @param  {Function} callback
     * @return {Void}
     * @throws {Error} If password is not set           
     */
    UserSchema.methods.saltPassword = function(callback) {
      if (this.password === null) {
        throw new Error("No password set");
      }

      // Init
      var self = this;
      // Generate a random salt
      this.generateSalt(function(error, randomSalt) {
        try {
          // Salt the password
          var saltedPassword = self.getSaltedPassword(
            self.password,
            randomSalt
          );

          // Set new values for password and salt fields
          self.password = saltedPassword;
          self.salt     = randomSalt;

          callback(null, saltedPassword);
        }
        catch (_error) {
          callback(_error, null);
        }
      });
    };

    /**
     * Checks whether the current password is matching or not.
     * 
     * @param  {String} password
     * @return {Boolean}         
     */
    UserSchema.methods.isPasswordMatching = function(password) {
      if (this.password === null || this.salt === null) {
        throw new Error("Password not set on current instance");
      }

      return this.getSaltedPassword(password, this.salt) === this.password;
    };

    /**
     * Finds a user by email.
     * 
     * @param  {String}   email   
     * @param  {Function} callback
     * @return {Void}           
     */
    UserSchema.statics.findByEmail = function(email, callback) {
      this.findOne({ email: email }, callback);
    };

    return mongoose.model('User', UserSchema);
};