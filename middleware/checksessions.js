module.exports = function(publicRoutes) {
  return function(req, res, next) {
    var loggedIn = typeof req.session.user !== "undefined";

    var shouldRedirect = !loggedIn;
    if (shouldRedirect && req.route.params.length > 0) {
      var route = req.route.params.pop();
      var askedRouteSplitted = route.split("/");
      shouldRedirect = publicRoutes.indexOf("/" + route) === -1;
      if (shouldRedirect) {
        var isAMatch = function(askedRoute, pubRoute) {
          if (pubRoute) {
            return new RegExp("/" + pubRoute).test("/" + askedRoute);
          } else {
            return false;
          }
        };
        var i = 0;
        while (shouldRedirect && (i < publicRoutes.length)) {
          var splittedPubRoute = publicRoutes[i].split("/");
          if (splittedPubRoute.length - 1 == askedRouteSplitted.length) {
            var matchThisRoute = true;
            for (var j = 1; j < splittedPubRoute.length; j++) {
              matchThisRoute = matchThisRoute && isAMatch(askedRouteSplitted[j - 1], splittedPubRoute[j]);
            }
            if (matchThisRoute) {
              shouldRedirect = false;
            }
          }
          i++;
        }
      }
    }
    if (shouldRedirect) {
      res.redirect("/");
    } else {
      req.metaData={};
      req.metaData.current_user = req.session.user;
      next();
    }

  }
};