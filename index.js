var env = process.env;
var nodemailer = require("nodemailer");

module.exports = {
  port: env.PORT ? parseInt(env.PORT, 10) : 1337,
  PG: {
    PG_URL: env.PG_URL ? env.PG_URL : "postgres://fhljnzxbofoder:3gzWX9-ar4gQvf3fkTZtRMB7-U@ec2-54-225-101-119.compute-1.amazonaws.com:5432/d8b8ndvc70oq81?ssl=true"
  },
  Cookie: {
    Secret: env.COOKIE_SECRET ? env.COOKIE_SECRET : "UMCuwKPR2AfCCPVZz4bd8cft"
  },
  Session: {
    Secret: env.SESSION_SECRET ? env.SESSION_SECRET : "ExvbvvqUZpv4vvnWbMkGV3An"
  },
  Mailer: {
    Transport: nodemailer.createTransport("SMTP", {
      service: "Gmail",
      auth: {
        user: "theblacklistap@gmail.com",
        pass: "Cqj3XNsHqV8tKvjq"
      }
    })
  }
};