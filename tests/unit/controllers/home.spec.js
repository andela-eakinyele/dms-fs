describe('StartPageCtrl tests', function() {
  var scope,
    state,
    httpBackend,
    controller;

  beforeEach(function() {
    module('prodocs');
  });


  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    scope = $injector.get('$rootScope');
    controller = $controller('StartPageCtrl', {
      $scope: scope,
    });
    state = $injector.get('$state');
    httpBackend = $injector.get('$httpBackend');
    httpBackend
      .whenGET('/api/session')
      .respond(200, [{
        res: 'res'
      }]);
    httpBackend
      .whenGET('views/home.html')
      .respond(200, [{
        res: 'res'
      }]);
  }));

  it('should call initialize the controller', function() {
    expect(scope.showButton).toBeDefined();
  });

  it('should call watch the current state', function() {
    state.current.name = 'home.login';
    scope.$digest();
    expect(state.current.name).toBe('home.login');
    expect(scope.showButton).toBe(false);
  });

  it('should call watch the current state for home.features', function() {
    state.current.name = 'home.features';
    scope.$digest();
    expect(state.current.name).toBe('home.features');
    expect(scope.showButton).toBe(true);
  });

});
