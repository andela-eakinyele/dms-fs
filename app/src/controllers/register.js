(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('SignupCtrl', ['$rootScope', '$scope', '$state',
      'Users', 'Auth',
      function($rootScope, $scope, $state, Users, Auth) {

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
                console.log(err);
                $scope.signupErr = 'Error Logging you In';
              } else {
                Auth.setToken(JSON.stringify(res.data), '');
                $rootScope.activeUser = res.data.user;
                $state.go('home.group', {
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
