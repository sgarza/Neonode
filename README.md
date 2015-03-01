# Setup

Clone this repository

Install Redis

    brew install redis


Install MySQL, Postgres (optional)

    npm install
    npm install webpack -g
    cp config/config-example.json config/config.json

Edit config.json


### Run the server

    webpack -d -w
    node bin/server.js

# Usage

## Database Migrations

Neonode uses [Knex][1] to access databases and you can use it to generate querys and migrate the DB. Read [Knex Migrations][2]


## Code Examples

### User Model Example

```javascript
Models.User = Class(Models,'User').inherits(Model)({

  constraints : {
    email : {
      email : {
        message : 'Invalid email.'
      },
      length : {
        maximum : 255,
        tooLong : 'Email can't be more than %{count} characters.'
      }
    }
  },

  all : function(callback) {
    // this will select all records in Users table
    application.db('Users')
      .exec(callback)
  },

  findBy : function(clauses, callback) {
    // clauses = {name : "Joe", departmentId : 1}
    // Read knexjs.org documentation for more options.
    application.db('Users')
      .where(clauses)
      .exec(callback)

  },

  findById : function(id, callback) {
    application.db('Users')
      .where('id', id)
      .exec(function(err, user) {
        if (err) {callback(err)};

        user = user[0];

        callback(null, user);
      });

  },

  prototype : {
    id                : null,
    email             : false,
    password          : false,
    name              : null,
    createdAt         : null,
    updatedAt         : null,

    _create : function _create(callback) {
      var model = this;
      model.createdAt = new Date();
      model.updatedAt = new Date();

      var record = model;

      delete record.eventListeners;

      logger.log('Creating', record)

      application.db('Users')
        .insert(record)
        .returning('id')
        .exec(callback);
    },

    _update : function _update(callback) {
      var model = this;

      var id = model.id;

      delete model.id;
      delete model.createdAt;

      var record = model;

      delete record.eventListeners;

      model.updatedAt = new Date();

      application.db('Users')
        .where('id', id)
        .update(record)
        .returning('id')
        .exec(callback);
    },

    setPassword : function setPassword(password) {
      var model = this;

      model.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

      return model.password;
    },

    isValidPassword : function isValidPassword(password) {
      var model = this;

      return bcrypt.compareSync(password, model.password);
    }
  }
});

module.exports = Models.User;
```

### Restfull UsersController example

```javascript
var UsersController = Class('UsersController').inherits(RestfulController)({
  prototype : {
    index : function index(req, res) {
      if (req.isAuthenticated()) {
        User.all(function(err, users) {
          if (err) {
            res.status(500).send(err);
          }
          res.render('users/index.html', {layout : 'application', users: users});
        });
      } else {
        req.flash('info', 'Not Authorized.');
        res.redirect('/');
      }
    },

    show : function show(req, res) {
      if (req.isAuthenticated()) {
        User.findById(req.params.id, function(err, user) {
          if (err) {
            res.status(500).send(err);
          }

          res.render('users/show.html', {layout : 'application', user : user[0]});
        });
      } else {
        req.flash('info', 'Not Authorized.');
        res.redirect('/');
      }
    },

    new : function(req, res) {
      if (req.isAuthenticated()) {
        res.render('users/new.html');
      } else {
        req.flash('info', 'Not Authorized.');
        res.redirect('/');
      }
    },

    create : function create(req, res) {
      if (req.isAuthenticated()) {
        var user = new User(req.body);

        user.setPassowrd(user.passord);

        user.save(function(err, user) {
          if (err) {
            res.status(500).send(err);
          }

          req.flash('success', 'Record has been successfully created.');
          res.redirect('/user/' + user[0]);
        });
      } else {
        req.flash('info', 'Not Authorized.');
        res.redirect('/');
      }
    },

    edit : function edit(req, res) {
      User.findById(req.params.id, function(err, user) {
        if (err) {
          res.status(500).send(err);
        }

        if (user.length === 0) {
          res.status(404).send('Not Found');
        }

        res.render('users/edit.html', {layout : 'application', user : user[0]});
      });
    },

    update : function update(req, res) {
      var userData = req.body;

      var user = new User(userData);

      if (userData.password) {
        user.setPassowrd(userData.password);
      }

      user.save(function(err, result) {
        if (err) {
          res.status(500).send(err);
        }

        res.redirect('user/' + result[0]);
      });

    },

    destroy : function destroy(req, res) {
        User.findById(req.params.id, function(err, result) {
            if (err) {
                res.status(500).send(err);
            }

            var user = new User(result);
            user.destroy(function(err, data) {
                if (err) {
                    res.status(500).send(err);
                }

                req.flash('success', 'Record has been deleted.');
                res.redirect('/');
            })
        })
    }
  }
});

module.exports = new UsersController();
```

[1]: http://knexjs.org/
[2]: http://knexjs.org/#Migrations
