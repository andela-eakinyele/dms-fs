(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('DashBoardCtrl', ['$scope', '$mdMedia',
      '$mdSidenav', 'Docs',
      function($scope, $mdMedia, $mdSidenav, Docs) {

        // side navigation bar control
        $scope.openLeft = function() {
          $mdSidenav('lefty').toggle();
        };

        $scope.close = function() {
          $mdSidenav('lefty').close();
        };

        // menu control
        $scope.openMenu = function($mdOpenMenu, ev) {
          $mdOpenMenu(ev);
        };

        $scope.getExt = function(name) {
          var extStart = name.lastIndexOf('.');
          return {
            name: name.substring(0, extStart),
            ext: name.substring(extStart + 1)
          };
        };


        $scope.viewing = false;

        $scope.viewDoc = function(id) {
          $scope.viewing = true;
        };

        $scope.testDocs = [{
          name: '1.jsx',
          title: 'Shake and Bake',
          ownerId: 'Emmy Akin',
          shared: true,
          date: '12-11-1654'
        }, {
          name: '2.js',
          title: 'Trust and Obey',
          ownerId: 'Emmy Akin',
          shared: false,
          date: '12-11-1654'
        }, {
          name: '3.jsx',
          title: 'Shake and Bake',
          ownerId: 'Emmy Akin',
          shared: true,
          date: '12-11-1654'
        }, {
          name: '4.js',
          title: 'Trust and Obey',
          ownerId: 'Emmy Akin',
          shared: false,
          date: '12-11-1654'
        }, {
          name: '5.jsx',
          title: 'Shake and Bake',
          ownerId: 'Emmy Akin',
          shared: true,
          date: '12-11-1654'
        }, {
          name: '6.js',
          title: 'Trust and Obey',
          ownerId: 'Emmy Akin',
          shared: false,
          date: '12-11-1654'
        }];

        $scope.filterExt = window._
          .chain($scope.testDocs)
          .map('name')
          .map(function(name) {
            return $scope.getExt(name).ext;
          }).uniq().value();

        $scope.sideBarMenu = [{
          name: 'View Documents',
          subMenu: ['My Documents', 'Shared Documents']
        }, {
          name: 'FileTypes',
          subMenu: $scope.filterExt
        }];

        $scope.docMenu = [{
          name: 'Edit Doc',
          icon: 'fa fa-pencil-square-o fa-2x'
        }, {
          name: 'Delete',
          icon: 'fa fa-trash fa-2x'
        }];

        $scope.menu = [{
          name: 'New Doc',
          icon: 'fa fa-file-text-o fa-2x'
        }, {
          name: 'User Profile',
          icon: 'fa fa-cog fa-2x'
        }, {
          name: 'Log Out',
          icon: 'fa fa-sign-out fa-2x'
        }];

        $scope.adminMenu = {
          name: 'Add User/Role',
          icon: 'fa fa-user-plus fa-2x',
          subMenu: [{
            name: 'New Users',
            icon: 'fa fa-user'
          }, {
            name: 'New Role',
            icon: 'fa fa-briefcase'
          }]
        };







        $scope.toggleSearch = false;
        $scope.headers = [{
          name: 'FileName',
          field: 'filename'
        }, {
          name: 'Title',
          field: 'title'
        }, {
          name: 'Owner',
          field: 'owner'
        }, {
          name: 'Last Modified',
          field: 'lastModified'
        }, {
          name: 'Shared',
          field: 'shared'
        }, {
          name: 'Type',
          field: 'ext'
        }];


      }

    ]);
})();
