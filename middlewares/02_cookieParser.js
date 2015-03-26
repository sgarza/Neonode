// *************************************************************************
//                            Cookie Parser
// *************************************************************************
logger.log("Setting cookieParser");
module.exports = cookieParser(CONFIG.sessionSecret);
