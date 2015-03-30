module.exports = function(err, req, res, next) {
  logger.error(err.stack);
  res.status(500);
  res.render('shared/500.html', {layout : false, error : err.stack})
}
