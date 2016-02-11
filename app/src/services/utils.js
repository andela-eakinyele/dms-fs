(function() {
  'use strict';
  angular.module('prodocs.services')
    .service('Utils', function($mdToast, $mdDialog, $http) {


      this.toast = function(msg) {
        $mdToast.show($mdToast.simple().content(msg));
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


      this.custom = function(ev, title, action, data, tmpl, cb) {

        $mdDialog.show({
            controller: DialogController,
            templateUrl: tmpl,
            parent: angular.element(document.querySelector('#dashContent')),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: true
          })
          .then(function(answer) {
            cb(answer);
          }, function() {
            cb('No Action');
            console.log('Error in Dialog');
          });

        function DialogController($scope, $mdDialog) {

          $scope.title = title;
          $scope.action = action;
          $scope.data = data;

          $scope.hide = function() {
            $mdDialog.hide();
          };

          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.answer = function(answer) {
            $mdDialog.hide(answer);
          };
        }
      };

      this.fetch = function(path) {
        return $http.get(path).then(function(resp) {
          return resp;
        });
      };

    });

})();
