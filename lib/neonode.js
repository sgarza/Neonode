#!/usr/bin/env node

require('colors');

var fs      = require('fs');
var mkdirp  =  require('mkdirp');
var prompt  = require('prompt');
var ncp     = require('ncp').ncp;
var rmdir   = require('rimraf');

require('neon');
require('neon/stdlib');

require('fluorine');

var nopt        = require("nopt");
var inflection  = require('inflection');

Class('Neonode')({
  prototype : {
    options : null,
    knownOpts : {
      "init" : Boolean,
      "help"   : Boolean
    },
    shortHands : {
      "h" : ["--help"]
    },

    init : function init() {
      this.options = nopt(this.knownOpts, this.shortHands, process.argv, 2);
      this.run();
    },

    showHelp : function showHelp() {
      var help = fs.readFileSync('./lib/neonode/templates/help.txt', 'utf8');
      console.log(help)
      this.exit();
    },

    run : function run() {
      var neonode = this;

      if (this.options.init) {
        prompt.start();

        var flow = new Flow({ name : 'createApp'});

        prompt.message = "Neonode: ".white;

        prompt.get({
          properties: {
            name: {
              description: "Whats your project name?".green,
              required : true,
              type : 'string',
              pattern : /^[[\w+-_]+$/,
              default : 'neonode',
              conform: function (value) {
                return true;
              }
            },
            description: {
              description: "Whats your project description?".green,
              required : true,
              type : 'string',
              default : ''
            },
            version: {
              description : "Whats your project version?".green,
              required : true,
              type : 'string',
              default : '0.0.1'
            }
          }
        }, function (err, result) {
          var cwd = process.cwd();
          var sourceDir = __dirname + '/../.';
          var destDir = cwd + '/' + result.name;

          // Create dir
          if (!fs.existsSync(destDir)) {
            console.log("Creating ./" + result.name + ' directory');
            mkdirp.sync(cwd + '/' + result.name);

            // Copy base project
            console.log('Copying base project structure...');
            ncp(sourceDir, destDir, function(err) {
              if (err) {
                console.log("Error".red);
                console.log(err);
              }

              console.log('Creating package.json ...');

              var pack = JSON.parse(fs.readFileSync(destDir + '/package.json', 'utf8'));

              pack.name = result.name;
              pack.description = result.description;
              pack.version = result.version;

              delete pack.repository;
              delete pack.readme;
              delete pack.readmeFilename;
              delete pack.bin;
              delete pack.gitHead;
              delete pack.bugs;
              delete pack.homepage;
              delete pack._shasum;
              delete pack._from;
              delete pack._resolved;

              fs.writeFileSync(destDir + '/package.json', JSON.stringify(pack, null, 2), 'utf8');

              rmdir.sync(destDir + '/lib/neonode');
              fs.unlinkSync(destDir + '/lib/neonode.js');
              fs.unlinkSync(destDir + '/index.js');
              fs.unlinkSync(destDir + '/README.md');
              fs.closeSync(fs.openSync(destDir + '/README.md', 'w'));

              console.log('Done.'.green)
            });

          } else {
            console.log('Directory '.red + cwd.green + '/'.green + result.name.green + ' already exists'.red);
            neonode.exit();
          }

        });
      }

      if (this.options.help) {
        this.showHelp()
      }
    },

    exit : function exit(){
      process.exit(1);
    }
  }
});

var neonode = new Neonode();
