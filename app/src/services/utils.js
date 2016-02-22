(function() {
  'use strict';
  angular.module('prodocs.services')
    .service('Utils', function($mdToast, $mdDialog, $http, $filter) {

      // format date data
      this.parseDate = function(date) {
        return {
          day: $filter('date')(date, 'EEEE dd MMM yyyy'),
          time: $filter('date')(date, 'hh:mma')
        };
      };

      this.showAlert = function(ev, title, msg) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title(title)
          .textContent(msg)
          .ariaLabel('Alert Dialog Demo')
          .ok('Close')
          .targetEvent(ev)
        );
      };

      this.showConfirm = function(ev, title, content, action, cb) {
        var confirm = $mdDialog.confirm()
          .title(title)
          .textContent(content)
          .ariaLabel('Confirm Action')
          .targetEvent(ev)
          .ok(action)
          .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
          cb();
        }, function() {});
      };
    });

})();
