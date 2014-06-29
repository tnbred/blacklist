var env = process.env;
var nodemailer = require("nodemailer");

module.exports = {
  port: env.PORT ? parseInt(env.PORT, 10) : 1337,
  PG: {
    PG_URL: env.PG_URL ? env.PG_URL : ""
  },
  Cookie: {
    Secret: env.COOKIE_SECRET ? env.COOKIE_SECRET : ""
  },
  Session: {
    Secret: env.SESSION_SECRET ? env.SESSION_SECRET : ""
  },
  Mailer: {
    Transport: nodemailer.createTransport("SMTP", {
      service: "",
      auth: {
        user: "",
        pass: ""
      }
    })
  }
};