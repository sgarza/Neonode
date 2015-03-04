Neonode is a [Neon.js][3] powered MVC stack.


## Usage

    npm install -g neonode

    neonode --init

Fill the prompts and this will create a project in the directory specified

## Requirements

### Install node module dependencies

    npm install

### Install Redis (optional)

    brew install redis


### Install MySQL or Postgres (optional)

### Install webpack as a global npm module

    npm install webpack -g

## Setup

Once a new project is created:

    cp config/config-example.js config/config.js

Edit config.json as needed.


### Run the server

    redis-server
    webpack -d -w
    node bin/server.js


## Database Migrations

Neonode uses [Knex][1] to access databases and you can use it to generate queries and migrate the DB. Read [Knex Migrations][2]

## Controllers Generator

For Restful and non-Restful controllers run:

    neonode --create controller

## Models

    neonode --create model


## Credits

Neonode is posible thanks to these wonderful libraries

[Neon][3]
[Thulium][4]
[Lithium][5]
[Argon][6]
[Fuorine][7]
[Cobalt][8]



[1]: http://knexjs.org/
[2]: http://knexjs.org/#Migrations
[3]: https://github.com/azendal/neon
[4]: https://github.com/freshout-dev/thulium
[5]: https://github.com/freshout-dev/lithium
[6]: https://github.com/sgarza/argon/tree/node-callback-convention
[7]: https://github.com/freshout-dev/fluorine
[8]: https://github.com/benbeltran/cobalt
