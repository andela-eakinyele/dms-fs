(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('SignupCtrl', ['$rootScope', '$scope', '$state',
      'Users', 'Auth', 'Utils',
      function($rootScope, $scope, $state, Users, Auth, Utils) {

        $scope.init = function() {
          $scope.signupErr = 'Please fill in your details below';
          $scope.signform = {};
        };

        $scope.createUser = function() {
          Users.save($scope.signform, function() {
            $scope.isRegistered = true;
            Users.login({
              username: $scope.signform.username,
              password: $scope.signform.password
            }, function(err, res) {
              if (err) {
                $scope.signupErr = 'Error Logging you In';
              } else {
                Utils.showAlert(null, 'Logged In', 'You are Logged in, ' +
                  'Please create or Select a group');
                Auth.setToken(JSON.stringify(res.data), '');
                $rootScope.activeUser = res.data.user;

                $state.go('dashboard.group', {
                  id: res.data.user._id
                });
              }
            });
          }, function(err) {
            if (err.status === 409) {
              $scope.signupErr = 'Username/Email Already Exists';
            } else {
              $scope.signupErr = 'Error registering your details' +
                ' /Please Try Again';
            }
          });
        };

        // initialize controller
        $scope.init();
      }
    ]);
})();
