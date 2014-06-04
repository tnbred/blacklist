
var env = process.env;

module.exports = {
  FinestLife: {
    port : env.PORT ? parseInt(env.PORT, 10) : 80
  },
  PG: {
    PG_URL : env.PG_URL? env.PG_URL : ""
  },
  Cookie: {
    Secret : env.COOKIE_SECRET ? env.COOKIE_SECRET : ""
  },
  Session: {
    Secret : env.SESSION_SECRET ? env.SESSION_SECRET : ""
  }
};
