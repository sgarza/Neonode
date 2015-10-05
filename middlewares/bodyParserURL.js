// *************************************************************************
//                           Body Parser urlEncoded
// *************************************************************************
logger.log("Setting bodyParser URL");
module.exports = require('body-parser').urlencoded({extended: true});
