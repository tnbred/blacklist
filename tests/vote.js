var Bookshelf = require('bookshelf')
Bookshelf.PG = Bookshelf.initialize({
	client: 'pg',
	connection: "bsurl"
});
var models = require(__dirname + "/../models")
var Vote = models.Vote


module.exports = {
	setUp: function(callback) {
		var today = Date.today()
		this.today = today
		this.votes = [{
			user_to_id: 1,
			user_id: 2,
			created_at: today,
			points: 5
		}, {
			user_to_id: 2,
			user_id: 1,
			created_at: today,
			points: 10
		}, {
			user_to_id: 3,
			user_id: 1,
			created_at: today,
			points: 20
		}]
		this.users = [{
			id: '3'
		}, {
			id: '2'
		}, {
			id: '1'
		}]
		callback()
	},
	tearDown: function(callback) {
		setTimeout(function() {
			process.exit(0)
		}, 500)
		callback();
	},
	testGetLatestVotes: function(test) {
		test.expect(1);
		var latestVotes = new Vote().getLatestVotes(this.votes, this.users)
		var res = [{
			points: 5,
			created_at: this.today,
			userTo: {
				id: '1'
			}
		}, {
			points: 10,
			created_at: this.today,
			userTo: {
				id: '2'
			}
		}, {
			points: 20,
			created_at: this.today,
			userTo: {
				id: '3'
			}
		}]
		test.deepEqual(latestVotes, res)
		test.done()
	}
};