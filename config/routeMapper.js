var routeMapper = new RouteMapper.Mapper();

routeMapper
  .root('home#index')
  .get('/no-layout', {to : 'home#noLayout'});

module.exports = routeMapper;
