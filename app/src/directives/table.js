(function() {
  'use strict';
  angular.module('prodocs.directives')
    .directive('mdColresize', function($timeout) {
      return {
        restrict: 'A',
        link: function(scope, element) {
          scope.$evalAsync(function() {
            $timeout(function() {
              $(element).colResizable({
                liveDrag: true,
                fixed: true
              });
            }, 100);

          });
        }
      };
    });
})();
