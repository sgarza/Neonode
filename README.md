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

[1]: http://knexjs.org/
[2]: http://knexjs.org/#Migrations
