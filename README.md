# [Neon.js][3] powered MVC Full-Stack development Anti-Framework.


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

To compile assets in dev mode

    webpack -d

To compile assets in production mode

    webpack -p

Go to [Webpack documentation](http://webpack.github.io/docs/)

## Setup

Once a new project is created:

    cp config/config-example.js config/config.js

Edit config.json as needed.


### Run the server

    redis-server (optional)
    npm start

## Database Migrations

Neonode uses [Knex][1] to access databases and you can use it to generate queries and migrate the DB. Read [Knex Migrations][2]

## Controllers Generator

For Restful and non-Restful controllers run:

    neonode --create controller

## Models

    neonode --create model

## Middlewares

Middlewares are now located in ./middlewares and they are loaded in filename ASC order for your tweaking or adding pleasure.

## Examples

* [Authentication, Users Model and Users Restful Controller][9]

## Contributing and Feature Requests

You **MUST** read [CONTRIBUTING.md](CONTRIBUTING.md) before you start filing a issue or making a Pull Request.

## Troubleshooting

Delete /usr/local/bin/neonode if you have a < 2.0.0 version installed

## Credits

Neonode is possible thanks to these wonderful libraries

[Neon][3]

[Thulium][4]

[Lithium][5]

[Argon][6]

[Fuorine][7]

[Cobalt][8]

## CHANGELOG

Read [CHANGELOG.md](CHANGELOG.md)


[1]: http://knexjs.org/
[2]: http://knexjs.org/#Migrations
[3]: https://github.com/azendal/neon
[4]: https://github.com/freshout-dev/thulium
[5]: https://github.com/freshout-dev/lithium
[6]: https://github.com/sgarza/argon/tree/node-callback-convention
[7]: https://github.com/freshout-dev/fluorine
[8]: https://github.com/benbeltran/cobalt
[9]: https://github.com/sgarza/Neonode/wiki/Authentication-with-Passport,-Users-Model,-Users-Restful-Controller-Example
