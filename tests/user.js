var Bookshelf = require('bookshelf')
Bookshelf.PG = Bookshelf.initialize({
	client: 'pg',
	connection: "bsurl"
});
var models = require(__dirname + "/../models")
var User = models.User


module.exports = {
	setUp: function(callback) {
		this.testPassword = "bouboup"
		this.votes = [{
			user_to_id: 1,
			user_id: 2,
			created_at: Date.today(),
			points: 5
		}, {
			user_to_id: 2,
			user_id: 1,
			created_at: Date.today(),
			points: 10
		}, {
			user_to_id: 3,
			user_id: 1,
			created_at: Date.today(),
			points: 20
		}]
		this.rankArray = [{
			userId: '3',
			points: 20
		}, {
			userId: '2',
			points: 10
		}, {
			userId: '1',
			points: 5
		}]
		callback()
	},
	tearDown: function(callback) {
		setTimeout(function() {
			process.exit(0)
		}, 500)
		callback();
	},
	testSaltPassword: function(test) {
		test.expect(2);
		var password = this.testPassword
		var user = new User({
			password: password
		})
		user.saltPassword(function(error) {
			var hashedPassword = user.toJSON().password
			test.equal(hashedPassword.length, 40)
			test.notEqual(hashedPassword, password)
			test.done()

		})
	},
	testIsPasswordMathing: function(test) {
		test.expect(1);
		var password = this.testPassword;
		var user = new User({
			password: password
		})
		user.saltPassword(function(error) {
			test.equal(user.isPasswordMatching(password), true)
			test.done()
		})
	},
	testfindPointsOnList: function(test) {
		test.expect(1)
		var votes = this.votes
		var pointsOnList = new User().findPointsOnList(1, votes);
		test.equal(pointsOnList, 5)
		test.done()
	},
	testfindPointsOnListFromRankArray: function(test) {
		test.expect(1)
		var rankArray = this.rankArray
		var pointsOnList = new User().findPointsOnListFromRankArray(1, rankArray);
		test.equal(pointsOnList, 5)
		test.done()
	},
	testFindRankArray: function(test) {
		test.expect(1)
		var votes = this.votes
		test.deepEqual(new User().findRankArray(votes), this.rankArray)
		test.done()
	},
	testgetPointsLeft: function(test) {
		test.expect(1)
		var votes = this.votes
		var pointsLeft = new User().getPointsLeft(1, votes);
		test.equal(pointsLeft, 0)
		test.done()
	},
	testfindRank: function(test) {
		test.expect(1)
		var votes = this.votes
		var rank = new User().findRank(1, votes,3);
		test.equal(rank, 3)
		test.done()
	}
};