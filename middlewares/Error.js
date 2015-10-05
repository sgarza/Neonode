module.exports = function(err, req, res, next) {
  logger.error(err.stack);
  if (err.name && err.name === 'NotFoundError') {
    return res.status(404).render('shared/404.html', {message : err.message});
  }

  res.status(500);
  res.render('shared/500.html', {layout : false, error : err.stack})
}
