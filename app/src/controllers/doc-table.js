(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('DocDocTableCtrl', ['$rootScope', '$scope', '$state',
      '$stateParams', 'Docs', 'Utils',
      function($rootScope, $scope, $state, $stateParams, Docs, Utils) {

        $scope.init = function() {
          $scope.selectedDocs = [];
          $scope.count = 0;

          $scope.query = {
            limit: 10,
            page: 1,
            order: 'title',
          };

          $scope.getDocs($scope.query);
        };

        $scope.getDocs = function(query) {

          // get document by user id
          if (/mydocs/.test($state.current.name)) {
            Docs.getUserDocs($stateParams.id,
              query,
              function(err, res) {
                if (err) {
                  Utils.showAlert(null, 'Error retrieving user documents');
                } else {
                  $scope.docs = res;

                  Docs.getUserDocsCount($stateParams.id,
                    function(err, res) {
                      if (err) {
                        Utils.showAlert(null, 'Error retrieving' +
                          ' user documents');
                      } else {
                        $scope.count = res;
                      }
                    });
                }
              });



            // get shared documents
          } else if (/shared/.test($state.current.name)) {
            Docs.getRoleDocs($stateParams.roleid,
              query,
              function(err, res) {
                if (err) {
                  Utils.showAlert(null, 'Error retrieving shared documents');
                } else {
                  $scope.docs = res;

                  Docs.getRoleDocsCount($stateParams.roleid,
                    function(err, res) {
                      if (err) {
                        Utils.showAlert(null, 'Error retrieving ' +
                          'shared documents');
                      } else {
                        $scope.count = res;
                      }
                    });
                }
              });

            // get all douments in group
          } else {
            Docs.query(query, function(res) {
                $scope.docs = res;

                Docs.count(function(err, res) {
                  if (err) {
                    Utils.showAlert(null, 'Error retrieving ' +
                      'documents');
                  } else {
                    $scope.count = res;
                  }
                });
              },
              function() {
                Utils.showAlert(null, 'Error retrieving documents');
              });
          }
        };


        $scope.onPaginate = function(page, limit) {
          $scope.selectedDocs = [];
          $scope.getDocs(angular.extend({}, $scope.query, {
            page: page,
            limit: limit
          }));
        };

        $scope.access = function(doc) {
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

        // menu control
        $scope.openMenu = function($mdOpenMenu, ev) {
          $mdOpenMenu(ev);
        };

        // Toggling Selection
        // Update selection  array
        $scope.toggle = function(item, list) {
          var role = list.indexOf(item);
          if (role > -1) {
            list.splice(role, 1);
          } else {
            list.push(item);
          }
        };

        // toggle select all items
        $scope.selectAll = function(items) {
          if ($scope.selectedDocs.length > 0) {
            $scope.selectedDocs = [];
          } else {
            $scope.selectedDocs = window._.map(items, '_id');
          }
        };

        // check item selection state
        $scope.isSelected = function(id, list) {
          return list.indexOf(id) > -1;
        };

        // check select all state
        $scope.all = function(items) {
          if ($scope.selectedDocs) {
            return $scope.selectedDocs.length === window._
              .map(items, '_id').length;
          } else {
            return false;
          }
        };

        // Menu button action
        $scope.menuAction = function(ev, id, evt) {
          if (ev === 'edit') {
            $state.go('dashboard.doc.edit', {
              docId: id
            });
          }
          if (ev === 'delete') {
            Utils.showConfirm(evt, 'Delete', 'Document will be deleted',
              'Delete',
              function() {
                Docs.delete({
                  id: id
                }, function() {
                  $state.go('dashboard.list.mydocs', {
                    id: $stateParams.id,
                    groupid: $stateParams.groupid
                  });
                }, function() {
                  Utils.showAlert(evt, 'Delete Action', 'Error ' +
                    'deleting document');
                });
              });
          }
        };

        $scope.refreshTable = function() {
          $scope.getDocs($scope.query);
          $scope.selectedDocs = [];
        };

        $scope.viewSelection = function() {
          var ids = window._.map($scope.selectedDocs, function(num) {
            return 'id=' + num;
          }).join('&');

          $state.go('dashboard.doc.view', {
            docIds: $scope.selectedDocs,
            docId: ids
          });
        };

        $scope.deleteSelection = function(evt) {
          Utils.showConfirm(evt, 'Delete', 'Documents will be deleted',
            'Delete',
            function() {
              Docs.bulkdelete($scope.selectedDocs, function() {
                $scope.docs = window._.filter($scope.docs, function(doc) {
                  return $scope.selectedDocs.indexOf(doc._id) < 0;
                });
                $scope.selectedDocs = [];

                $state.go('dashboard.list.mydocs', {
                  id: $stateParams.id,
                  groupid: $stateParams.groupid
                });
              }, function() {
                Utils.showAlert(evt, 'Delete Action', 'Error ' +
                  'deleting document');
              });
            });
        };

        $scope.headers = [{
            name: 'Label',
            field: 'label'
          }, {
            name: 'Title',
            field: 'title'
          }, {
            name: 'Owner',
            field: 'ownerId[0].name.first'
          }, {
            name: 'Date Created',
            field: 'dateCreated'
          }, {
            name: 'Last Modified',
            field: 'lastModified'
          }, {
            name: 'Shared',
            field: 'roles.length'
          },
          '',
        ];

        $scope.init();

      }
    ]);
})();
