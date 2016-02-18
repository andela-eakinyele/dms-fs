describe('FeatCtrl tests', function() {
  'use strict';
  var scope,
    state,
    controller;

  beforeEach(function() {
    module('prodocs');
  });


  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    scope = $injector.get('$rootScope');
    controller = $controller('FeatCtrl', {
      $scope: scope
    });
    state = $injector.get('$state');
  }));

  it('should call initialize the controller', function() {
    expect(scope.features).toBeDefined();
    scope.init();
    expect(scope.bigScreen).toBeDefined();
  });


});
