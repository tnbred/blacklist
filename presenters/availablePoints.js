module.exports = {
  availablePoints: function() {
    var context = this;
    var points = context.currentUser_PointsLeft;
    var res = ""
    for (var i = 0; i <= points; i++) { 
      res+="<option value=\""+i+"\">"+i+"</option>"
    }
    return res;
  }
}