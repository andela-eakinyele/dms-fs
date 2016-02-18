(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('TableCtrl', ['$rootScope', '$scope', '$state', '$stateParams',
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
                // console.log('Error retrieving docs for users');
              } else {
                $scope.docs = res;
              }
            });
          } else if (/shared/.test($state.current.name)) {
            Docs.getRoleDocs($stateParams.roleid, function(err, res) {
              if (err) {
                // console.log('Error retrieving Shared Docs');
              } else {
                $scope.docs = res;
              }
            });
          } else {
            $scope.docs = Docs.query();
          }
        };

        $scope.accessDoc = function(doc) {
          if (doc && $rootScope.activeUser) {
            var roleId = window._.map(doc.roles, '_id');
            var userRole = window._.map($rootScope.activeUser.roles, '_id');
            return userRole.some(function(a) {
              return roleId.indexOf(a) > -1;
            }) || $rootScope.activeUser._id === doc.ownerId[0]._id;
          }
        };

        $scope.editDoc = function(doc) {
          if (doc && $rootScope.activeUser) {
            return $rootScope.activeUser._id === doc.ownerId[0]._id;
          }
        };

        // format date data
        $scope.getDate = function(date) {
          return Utils.parseDate(date);
        };

        $scope.query = {
          order: 'Title',
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
              $state.go('dashboard.list.mydocs', {
                id: $stateParams._id,
                groupid: $stateParams.groupid
              });
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

        $scope.init();

      }

    ]);
})();
