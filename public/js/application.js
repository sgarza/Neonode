require('neon');
require('neon/stdlib');

var jQuery = require('./vendor/jquery-2.0.3.js');
window.jQuery = jQuery;
window.$ = jQuery;

require('./vendor/Widget.js');

window.validate = require('validate');

require('./../css/style.css');


