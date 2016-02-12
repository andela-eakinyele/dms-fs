(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('SignupCtrl', ['$rootScope', '$scope', '$state',
      'Users', 'Auth',
      function($rootScope, $scope, $state, Users, Auth) {

        $scope.init = function() {

          $scope.signupErr = 'Please fill in your details below';
          $scope.signform = {};
          // $scope.signform.name = {};
        };

        $scope.createUser = function() {
          console.log($scope.signform);
          Users.save($scope.signform, function() {
            $scope.isRegistered = true;
            Users.login({
              username: $scope.signform.username,
              password: $scope.signform.password
            }, function(err, res) {
              console.log(res);
              if (err) {
                $state.go('loginerror');
              } else {
                Auth.setToken(JSON.stringify(res));
                $rootScope.activeUser = res.user;
                if ($rootScope.activeUser.groupId.length > 0) {
                  $state.go('dashboard', {
                    userId: res.user._id,
                    groupId: res.user.groupId[0]
                  });
                } else {
                  $state.go('home.group', {
                    id: res.user._id
                  });
                }
              }
            });
          }, function(err) {
            if (err.status === 409) {
              $scope.signupErr = 'Username/Email Already Exists';
            } else {
              $scope.signupErr = 'Error creating User';
            }
          });
        };

        // initialize controller
        $scope.init();
      }
    ]);
})();
