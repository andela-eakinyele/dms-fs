(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('SignupCtrl', ['$rootScope', '$scope', '$state',
      'Users', 'Projects', 'Auth',
      function($rootScope, $scope, $state, Users, Projects, Auth) {

        $scope.init = function() {
          $scope.signupErr = "Start up";
          $scope.signform = {};
          $scope.signupErr = '';
          $scope.projects = Projects.query();
        };

        $scope.getRoles = function() {
          var title = $scope.signform.projectTitle;
          var pId = window._.findKey($scope.projects, ['_id', title]);
          console.log(title, pId, $scope.projects[pId].roles);
          $scope.roles = $scope.projects[pId].roles;
        };

        $scope.createUser = function() {
          console.log($scope.signform);
          Users.save($scope.signform, function(user) {
            $scope.isRegistered = true;
            Users.login({
              username: user.username,
              password: user.password
            }, function(err, res) {
              if (err) {
                $state.go('loginerror');
              } else {
                Auth.setToken(res.token);
                $rootScope.activeUser = res;
                $state.go('dashboard', {
                  projectId: user.projectId
                });
              }
            });
          }, function(err) {
            console.log(err, "Plice");
            $scope.signupErr = 'Error creating User';
          });
        };

        // initialize controller
        $scope.init();
      }
    ]);
})();
