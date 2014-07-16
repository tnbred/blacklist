var config = require(__dirname + "/../config")
var pg = require('pg')
var Bookshelf = require('bookshelf')

Bookshelf.PG = Bookshelf.initialize({
  client: 'pg',
  connection: config.PG.PG_URL
});

var connectionString = config.PG.PG_URL
var models = require(__dirname + "/../models")

pg.connect(connectionString, function(err, client, done) {

  if (process.argv[2] == "drop") {
    client.query('DROP TABLE comments', function(err, result) {
      done();
      if (err) return console.error(err);
      console.log(result.rows);
    });

    client.query('DROP TABLE lists', function(err, result) {
      done();
      if (err) return console.error(err);
      console.log(result.rows);
    });

    client.query('DROP TABLE list_user', function(err, result) {
      done();
      if (err) return console.error(err);
      console.log(result.rows);
    });

    client.query('DROP TABLE users', function(err, result) {
      done();
      if (err) return console.error(err);
      console.log(result.rows);
    });

    client.query('DROP TABLE votes', function(err, result) {
      done();
      if (err) return console.error(err);
      console.log(result.rows);

    });

  } else if (process.argv[2] == "seed") {
    var List = models.List
    var User = models.User
    var ListUser = models.ListUser
    var Vote = models.Vote

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createUser(name, email) {

      if (!email) email = "tnbredillet@gmail.com"

      var user = new User({
        email: email.toLowerCase(),
        approved: true,
        password: name.toLowerCase(),
        name: name
      })

      user.saltPassword(function(error) {
        // Save to mongo
        user.save().then(function(user) {
          console.log("Created user " + user.toJSON().email)
          new ListUser({
            user_id: user.toJSON().id,
            list_id: 1
          }).save().then(function(listuser) {
            console.log("Asigned " + listuser.toJSON().user_id + " to list " + listuser.toJSON().list_id)
          })
        })
      })
    }

    var list = new List({
      name: "Beta Testers 2014",
    });
    list.save()
    console.log("Created list " + list.toJSON().name)

    createUser("Thomas Bredillet", "tnbredillet@gmail.com")
    createUser("Antoine Dematteo", "antoinedematteo@gmail.com")
    createUser("Alexandre Bessis", "alexandre.bessis@gmail.com")
    createUser("HanCha Hvl", "hancharlottehvl@hotmail.com")
    createUser("Ari Desvaux", "aristide.desvaux@gmail.com")
    createUser("Francois Hollande")
    createUser("Manuel Valls")
    createUser("Francois Cope")
    createUser("Nicolas Sarkozy")
    createUser("Barrack Obama")
    createUser("Angela Merkel")
    createUser("Miley Cyrus")
    createUser("Justin Bieber")
    createUser("Amelie Nothomb")
    createUser("Les Chinois")
    createUser("Le Fisc")
    createUser("Vladimir Putin")
    createUser("David Cameron")
    createUser("Anne Hidalgo")
    createUser("Les Feministes")
    createUser("Jonathan 'Mozart' Hadida")
    createUser("Sncf Ratp")
    createUser("Les Flics")
    createUser("Les Gros")


    numberOfCreatedUser=23

    for (var i = 1; i <= numberOfCreatedUser; i++) {
      new Vote({
        user_id: i,
        user_to_id: getRandomInt(1, numberOfCreatedUser),
        points: getRandomInt(1, 6),
        list_id: 1
      }).save().then(function(vote) {
        console.log("Voted " + vote.toJSON().points + " points from " + vote.toJSON().user_id + " to " + vote.toJSON().user_to_id + " on list " + vote.toJSON().list_id)
      })
    }

  } else if (process.argv[2] == "seed2") {
    var List = models.List
    var User = models.User
    var ListUser = models.ListUser
    var Vote = models.Vote

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var list = new List({
      name: "NYU Class 2014",
    });
    list.save()
    console.log("Created list " + list.toJSON().name)
    for (var i = 1; i <= 100; i++) {
      new User({
        email: "jarjar" + i,
        approved: true,
        password: "jarjar" + i + "@gmail.com",
        firstname: "Ja" + i,
        lastname: "Smith" + i
      }).save().then(function(user) {
        console.log("Created user " + user.toJSON().email)
      });

      new ListUser({
        user_id: i,
        list_id: 1
      }).save().then(function(listuser) {
        console.log("Asigned " + listuser.toJSON().user_id + " to list " + listuser.toJSON().list_id)
      })

      new Vote({
        user_id: i,
        user_to_id: getRandomInt(1, 101),
        points: getRandomInt(1, 6),
        list_id: 1
      }).save().then(function(vote) {
        console.log("Voted " + vote.toJSON().points + " points from " + vote.toJSON().user_id + " to " + vote.toJSON().user_to_id + " on list " + vote.toJSON().list_id)
      })
    }

    var thomas = new User({
      email: "tnbredillet@gmail.com",
      approved: true,
      password: "bkag5pt1A!",
      firstname: "Thomas",
      lastname: "Bredillet"
    })

    thomas.saltPassword(function(error) {
      // Save to mongo
      thomas.save().then(function(user) {
        console.log("Created user " + user.toJSON().email)
        new ListUser({
          user_id: user.toJSON().id,
          list_id: 1
        }).save().then(function(listuser) {
          console.log("Asigned " + listuser.toJSON().user_id + " to list " + listuser.toJSON().list_id)
        })
      })
    })

  } else {
    client.query('CREATE TABLE comments (id SERIAL,list_id integer,user_id integer,comment text, created_at timestamp, updated_at timestamp)', function(err, result) {
      done();
      if (err) return console.error(err);
      console.log(result.rows);
    });

    client.query('CREATE TABLE lists (id SERIAL,name varchar(40), created_at timestamp, updated_at timestamp)', function(err, result) {
      done();
      if (err) return console.error(err);
      console.log(result.rows);

    });

    client.query('CREATE TABLE list_user (id SERIAL,list_id integer,user_id integer, created_at timestamp, updated_at timestamp)', function(err, result) {
      done();
      if (err) return console.error(err);
      console.log(result.rows);
    });

    client.query('CREATE TABLE users (id SERIAL,email varchar(40),password varchar(40), name varchar(100),nickName varchar(40),approved boolean,salt varchar(40),lastlogin_at timestamp,loginCount integer,created_at timestamp, updated_at timestamp)', function(err, result) {
      done();
      if (err) return console.error(err);
      console.log(result.rows);
    });

    client.query('CREATE TABLE votes (id SERIAL,points integer,user_id integer,user_to_id integer,list_id integer,created_at timestamp, updated_at timestamp)', function(err, result) {
      done();
      if (err) return console.error(err);
      console.log(result.rows);
    });

    client.query('CREATE TABLE comments_likes (id SERIAL,user_id integer,comment_id integer,created_at timestamp, updated_at timestamp)', function(err, result) {
      done();
      if (err) return console.error(err);
      console.log(result.rows);
    });

  }



});