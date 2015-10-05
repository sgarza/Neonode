// *************************************************************************
//                            Cookie Parser
// *************************************************************************
logger.log("Setting cookieParser");
module.exports = require('cookie-parser')(CONFIG.session.secret);
