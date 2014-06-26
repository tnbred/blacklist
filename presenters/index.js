module.exports = {
	formatDate: function() {
		function timeSince(date) {

			var seconds = Math.floor((new Date() - date) / 1000);

			var interval = Math.floor(seconds / 31536000);

			if (interval > 1) {
				return interval + " years";
			}
			interval = Math.floor(seconds / 2592000);
			if (interval > 1) {
				return interval + " months";
			}
			interval = Math.floor(seconds / 86400);
			if (interval > 1) {
				return interval + " days";
			}
			interval = Math.floor(seconds / 3600);
			if (interval > 1) {
				return interval + " hours";
			}
			interval = Math.floor(seconds / 60);
			if (interval > 1) {
				return interval + " minutes";
			}
			return Math.floor(seconds) + " seconds";
		}

		var context = this;
		var date = context.created_at;
		return (timeSince(date) + " ago.");
	},
	formatAvailablePoints: function() {
		var context = this;
		var points = context.currentUser_PointsLeft;
		var res = ""
		for (var i = 1; i <= points; i++) {
			res += "<option 'value=\"" + i + "\">" + i + "</option>"
		}
		return res;
	}
}