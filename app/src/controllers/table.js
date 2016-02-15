(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('tableCtrl', ['$rootScope', '$scope', '$state', '$stateParams',
      'Docs', 'Utils',
      function($rootScope, $scope, $state, $stateParams, Docs, Utils) {

        $scope.init = function() {
          $scope.selectedDocs = [];
          $scope.getDocs();
        };

        $scope.getDocs = function() {
          if (/mydocs/.test($state.current.name)) {
            Docs.getUserDocs($stateParams.id, function(err, res) {
              if (err) {
                console.log('Error retrieving docs for users');
              } else {
                $scope.docs = res.data;
              }
            });
          } else {
            $scope.docs = Docs.query();
          }
        };

        $scope.accessDoc = function(doc) {
          var roleId = window._.map(doc.roles, '_id');
          var userRole = window._.map($rootScope.activeUser.roles, '_id');
          return userRole.some(function(a) {
            return roleId.indexOf(a) > -1;
          }) || $rootScope.activeUser._id === doc.ownerId[0]._id;
        };

        $scope.editDoc = function(doc) {
          return $rootScope.activeUser._id === doc.ownerId[0]._id;
        };

        // format date data
        $scope.getDate = function(date) {
          return Utils.parseDate(date);
        };

        $scope.query = {
          order: 'name',
          limit: 5,
          page: 1
        };

        // menu control
        $scope.openMenu = function($mdOpenMenu, ev) {
          $mdOpenMenu(ev);
        };

        // Update edit/delete docs array
        $scope.toggle = function(item, list) {
          var role = list.indexOf(item);
          if (role > -1) {
            list.splice(role, 1);
          } else {
            list.push(item);
          }
        };

        $scope.selectAll = function() {
          // body...
        };

        // Menu button action
        $scope.menuAction = function(ev, id) {
          if (ev === 'edit') {
            $state.go('dashboard.doc.edit', {
              docId: id
            });
          }
          if (ev === 'delete') {
            Docs.delete({
              id: id
            }, function() {
              Utils.showAlert(ev, 'Delete Action', 'Document' +
                'successfully deleted');
              $state.reload();

            });
          }
        };

        $scope.headers = [{
          name: 'Label',
          field: 'label'
        }, {
          name: 'Title',
          field: 'title'
        }, {
          name: 'Owner',
          field: 'ownerId'
        }, {
          name: 'Date Created',
          field: 'lastModified'
        }, {
          name: 'Last Modified',
          field: 'lastModified'
        }, {
          name: 'Shared',
          field: 'shared'
        }, {
          name: '',
          field: 'buttons '
        }];


        $scope.userHeaders = [{
          name: 'UserId',
          field: 'id'
        }, {
          name: 'Username',
          field: 'Username'
        }, {
          name: 'Name',
          field: 'fname'
        }, {
          name: 'Joined On',
          field: 'created'
        }, {
          name: 'Role',
          field: 'role'
        }, {
          name: 'No of Docs',
          field: 'docs'
        }, {
          name: 'active',
          field: 'active'
        }];


        $scope.testUsers = [{
          id: 1,
          username: 'Diskit',
          fname: 'Dissin Mockit',
          date: '12-11-1222',
          role: 'Driver',
          num: 50,
          active: false
        }];

        $scope.userMenu = [{
          name: 'Edit User',
          icon: 'fa fa-pencil-square-o fa-2x'
        }, {
          name: 'Delete',
          icon: 'fa fa-trash fa-2x',
        }];


        $scope.roleHeaders = [{
          name: 'RoleId',
          field: 'id'
        }, {
          name: 'Title',
          field: 'title'
        }, {
          name: 'No of Users',
          field: 'users'
        }, {
          name: 'Last Modified',
          field: 'modified'
        }];


        $scope.testRoles = [{
          id: 1,
          title: 'Driver',
          num: 50,
          date: '12-11-1222',
        }];

        $scope.RoleMenu = [{
          name: 'Edit User',
          icon: 'fa fa-pencil-square-o fa-2x'
        }, {
          name: 'Delete',
          icon: 'fa fa-trash fa-2x',
        }];

        $scope.init();

      }

    ]);
})();
