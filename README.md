# Usage

    npm install -g neonode

    neonode --init
    Fill the prompts and this will create a project in the directory specified

# Requirements

### Install node module dependencies

    npm install

### Install Redis

    brew install redis


### Install MySQL or Postgres (optional)

### Install webpack as a global npm module

    npm install webpack -g

# Setup

Once a new project is created:

    cp config/config-example.js config/config.js

Edit config.json as needed.


### Run the server

    redis-server
    webpack -d -w
    node bin/server.js


# Database Migrations

Neonode uses [Knex][1] to access databases and you can use it to generate queries and migrate the DB. Read [Knex Migrations][2]

# Controllers

WIP

# Models

WIP


[1]: http://knexjs.org/
[2]: http://knexjs.org/#Migrations
