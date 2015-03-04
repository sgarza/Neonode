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
require('thulium');

var nopt        = require("nopt");
var inflection  = require('inflection');

Class('Neonode')({
  prototype : {
    options : null,
    knownOpts : {
      "init" : Boolean,
      "help"   : Boolean,
      "create" : String
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

      prompt.start();
      prompt.message = "Neonode: ".white;

      if (this.options.init) {

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

              console.log('Done.'.green);
              neonode.exit();
            });

          } else {
            console.log('Directory '.red + cwd.green + '/'.green + result.name.green + ' already exists'.red);
            neonode.exit();
          }

        });
      }

      if (this.options.create || this.options.create == '') {
        switch (this.options.create) {
          case 'model':
            this.createModel();
            // this.exit();
            break;
          case 'controller':
            console.log('create controller');
            this.exit();
            break;
          case '':
          default:
            this.showHelp()
            break;
        }
      }

      if (this.options.argv.original.length === 0 || this.options.help) {
        this.showHelp();
      }

    },

    createModel : function createModel() {
      var neonode = this;

      prompt.get({
        properties: {
          name: {
            description: "Whats the model name?".green,
            required : true,
            type : 'string',
            default : 'Users'
          }
        }
      }, function (err, result) {
        var cwd = process.cwd();
        var sourceFile = __dirname + '/.././lib/neonode/templates/Model.js';
        var destFile = cwd + '/models/' + result.name + '.js';

        // Create dir
        if (!fs.existsSync(destFile)) {
          console.log("Creating ./models/" + result.name + '.js Model');

          var file = fs.readFileSync(sourceFile, 'utf8');

          var template = new Thulium({
            template : file
          });

          template.parseSync().renderSync({name : result.name});

          var result =  template.view;

          fs.writeFileSync(destFile, result, 'utf8');

          console.log('Done'.green);
          neonode.exit();
        } else {
          console.log('Model '.red + result.name.green + ' already exists'.red);
          neonode.exit();
        }

      });
    },

    exit : function exit(){
      process.exit(1);
    }
  }
});

var neonode = new Neonode();
