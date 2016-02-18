(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('AdminListCtrl', ['$rootScope', '$scope', '$state',
      '$stateParams', 'Groups', 'Roles', 'Docs',
      function($rootScope, $scope, $state, $stateParams, Groups, Roles, Docs) {

        $scope.userList = function() {

          $scope.roles = Roles.query({
            groupid: $stateParams.groupid
          });

          $scope.gridOptions1 = {
            paginationPageSizes: [10, 20, 30],
            paginationPageSize: 10,
            columnDefs: [{
              name: 'username'
            }, {
              name: 'email'
            }, {
              name: 'name.first'
            }, {
              name: 'name.last'
            }, {
              name: 'Role'
            }]
          };

          function roledata(role) {
            return window._.filter($scope.roles, {
              '_id': role
            });
          }

          Groups.get({
              id: $stateParams.groupid
            },
            function(res) {
              if (res) {
                var data = res.users;
                data = window._.map(data, function(a) {
                  window._.forEach(a.roles, function(b) {
                    var role = roledata(b);
                    if (role.length) {
                      a.Role = role[0].title;
                    }
                  });
                  return a;
                });
                $scope.gridOptions1.data = data;
              } else {
                $scope.userErr = 'There are no users in this group';
              }
            },
            function() {
              $scope.userErr = 'Error retrieving group users';
            });
        };

        $scope.roleList = function() {
          $scope.gridOptions2 = {
            paginationPageSizes: [10, 20, 30],
            paginationPageSize: 10,
            columnDefs: [{
              name: '_id'
            }, {
              name: 'title'
            }, {
              name: 'NoOfUsers'
            }]
          };

          Roles.query({
            groupid: $stateParams.groupid
          }, function(res) {
            if (res.length > 0) {
              $scope.roles = res;
              var data = window._.map($scope.roles, function(a) {
                a.NoOfUsers = a.users.length;
                return a;
              });
              $scope.gridOptions2.data = data;
            } else {
              $scope.roleErr = 'There are no roles in this group';
            }
          }, function() {
            $scope.roleErr = 'Error retrieving group roles';
          });
        };

        $scope.docList = function() {
          $scope.gridOptions3 = {
            paginationPageSizes: [10, 20, 30],
            paginationPageSize: 10,
            columnDefs: [{
              name: '_id'
            }, {
              name: 'label'
            }, {
              name: 'title'
            }, {
              name: 'Owner'
            }]
          };

          Docs.query(function(res) {
            if (res.length > 0) {
              $scope.docs = res;
              var data = window._.map($scope.docs, function(a) {
                a.Owner = a.ownerId[0].name.first + ' ' +
                  a.ownerId[0].name.last;
                return a;
              });
              $scope.gridOptions3.data = data;
            } else {
              $scope.docErr = 'There are no documents in this group';
            }
          }, function() {
            $scope.docErr = 'Error retrieving group documents';
          });
        };


      }
    ]);

})();
