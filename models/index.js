var Bookshelf = require('bookshelf').PG;
var DateJS = require('datejs');

var User = Bookshelf.Model.extend({

	tableName: 'users',
	hasTimestamps: true,
	lists: function() {
		return this.belongsToMany(List).through(ListUser);
	},
	votes: function() {
		return this.hasMany(Vote);
	},
	comments: function() {
		return this.hasMany(Comment);
	},

	replies: function(){
		return this.hasMany( ReplyComment);
	},

	generateSalt: function(callback) {
		var Crypto = require("crypto")
		var hash = Crypto.createHash("sha1")

		Crypto.randomBytes(256, function(error, buffer) {
			try {
				if (error) {
					throw error;
				} else {
					hash.update(buffer);
					callback(null, hash.digest("hex"));
				}
			} catch (_error) {
				callback(_error, null);
			}
		});
	},
	swapString: function(stringValue) {
		return stringValue.split('').map(function(character) {
			return String.fromCharCode(255 - character.charCodeAt(0));
		}).join('');
	},
	getSaltedPassword: function(password, salt) {
		var Crypto = require("crypto"),
			hash = Crypto.createHash("sha1");

		// Update the hash
		hash.update(
			[this.swapString(salt), password, salt].join('')
		);

		// Digest
		return hash.digest("hex");
	},
	saltPassword: function(callback) {
		var password = this.get("password");
		if (password === null) {
			throw new Error("No password set");
		}
		var self = this
			// Generate a random salt
		self.generateSalt(function(error, randomSalt) {
			try {
				// Salt the password
				var saltedPassword = self.getSaltedPassword(
					password,
					randomSalt
				);


				// Set new values for password and salt fields
				self.set("password", saltedPassword)
				self.set("salt", randomSalt)

				callback(null, saltedPassword);
			} catch (_error) {
				callback(_error, null);
			}
		});
	},
	isPasswordMatching: function(password) {
		if (this.get("password") === null || this.get("salt") === null) {
			throw new Error("Password not set on current instance");
		}

		return this.getSaltedPassword(password, this.get("salt")) === this.get("password");
	},
	findPointsOnList: function(id, votes) {
		var result = 0;
		for (var i in votes) {
			if (votes[i].user_to_id == id) {
				result += votes[i].points;
			}
		}
		return result;
	},
	findPointsOnListFromRankArray: function(id, rankArray) {
		var result = 0;
		for (var i in rankArray) {
			if (rankArray[i].userId == id) {
				result = rankArray[i].points;
			}
		}
		return result;
	},
	findRankArray: function(votes) {
		var result = 0;
		var tempHash = {};
		var tempArray = [];

		for (var i in votes) {
			if (!tempHash[votes[i].user_to_id]) {
				tempHash[votes[i].user_to_id] = this.findPointsOnList(votes[i].user_to_id, votes)
			}
		}
		Object.keys(tempHash).forEach(function(userId) {
			var points = tempHash[userId];
			tempArray.push({
				userId: userId,
				points: points
			});
		})
		tempArray.sort(function(a, b) {
			return b.points - a.points
		});
		return tempArray;
	},
	getPointsLeft: function(userId, votes) {
		var result = 25;
		for (var i in votes) {
			if ((userId == votes[i].user_id) && (votes[i].created_at > Date.today().previous().sunday())) {
				result -= votes[i].points;
			}
		}
		return (result < 0) ? 0 : result;
	},
	findRank: function(userId, rankArray, total) {
		var result = 0;
		var found = false;

		for (var i in rankArray) {
			result += 1;
			if (rankArray[i].userId == userId) {
				found = true;
				break;
			}
		}

		return (found) ? result : total;
	},

	updateTimeStamp: function(){
		this.lastlogin_at = Date.now();
		this.save();
	}
});



var List = Bookshelf.Model.extend({

	tableName: 'lists',
	hasTimestamps: true,
	users: function() {
		return this.belongsToMany(User).through(ListUser);
	},
	votes: function() {
		return this.hasMany(Vote);
	},
	comments: function() {
		return this.hasMany(Comment);
	}

});


var CommentLike = Bookshelf.Model.extend({

	tableName: 'comments_likes',
	hasTimestamps: true,
	user: function() {
		return this.belongsTo(User);
	},
	comment: function() {
		return this.belongsTo( Comment);
	}

});

var ListUser = Bookshelf.Model.extend({

	tableName: 'list_user',
	hasTimestamps: true,

	list: function() {
		return this.belongsTo(List);
	},

	user: function() {
		return this.belongsTo(User);
	}

});


var Vote = Bookshelf.Model.extend({

	tableName: 'votes',
	hasTimestamps: true,
	user: function() {
		return this.belongsTo(User);
	},
	list: function() {
		return this.belongsTo(List);
	},
	getLatestVotes: function(votes, users) {
		var latestVotes = votes

		latestVotes.sort(function(a, b) {
			return b.created_at - a.created_at
		});

		latestVotes = latestVotes.slice(0, 5)
		for (var i in latestVotes) {
			var temp = {}
			var user = null;
			var userTo = null;
			temp.points = latestVotes[i].points
			temp.created_at = latestVotes[i].created_at
			for (var j in users) {
				if (users[j].id == latestVotes[i].user_to_id) {
					temp.userTo = users[j]
				}
			}
			latestVotes[i]=temp
		}

		return latestVotes
	}
});

var Comment = Bookshelf.Model.extend({

	tableName: 'comments',
	hasTimestamps: true,
	list: function() {
		return this.belongsTo(List);
	},
	user: function() {
		return this.belongsTo(User);
	},
	likes: function() {
		return this.hasMany(CommentLike);
	},
	replies: function(){
		return this.hasMany( ReplyComment );
	}

});

var ReplyComment = Bookshelf.Model.extend({

	tableName: 'replyComments',
	hasTimestamps: true,

	comment: function() {
		return this.belongsTo( Comment );
	},
	user: function() {
		return this.belongsTo( User );
	}
	
})

module.exports = {
	User: User,
	List: List,
	Vote: Vote,
	Comment: Comment,
	CommentLike: CommentLike,
	ListUser: ListUser,
	ReplyComment: ReplyComment
}