(function() {
  'use strict';
  angular.module('prodocs.controllers')
    .controller('DocCtrl', ['$rootScope', '$scope', '$state', '$stateParams',
      'Utils', 'Docs', 'Roles',
      function($rootScope, $scope, $state, $stateParams,
        Utils, Docs, Roles) {

        $scope.init = function() {
          $scope.newDoc = {};
          $scope.newDoc.roles = [];
          $scope.roles = Roles.query({
            groupid: $stateParams.groupid
          });
        };

        $scope.loadDoc = function() {
          Docs.get({
            id: $stateParams.docId
          }, function(res) {
            $scope.doc = res;
          }, function() {});
        };

        // save a new document
        $scope.saveDoc = function(ev) {
          Docs.save($scope.newDoc, function(res) {
            Utils.showAlert(ev, 'Successfully saved', res.title);
            $state.go('dashboard.doc.view', {
              docId: res._id
            });
          }, function(err) {
            if (err.status === 409) {
              Utils.showAlert(ev, 'Title already Exists - Rename title');
            } else {
              Utils.showAlert(ev, 'Error saving document');
            }
          });
        };

        // update a document
        $scope.updateDoc = function(ev) {
          Docs.update({
            id: $stateParams.docId
          }, $scope.doc, function(res) {
            Utils.showAlert(ev, 'Successfully updated', res.title);
            $state.go('dashboard.doc.view', {
              docId: res._id
            });
          }, function(err) {
            if (err.status === 409) {
              Utils.showAlert(ev, 'Title already Exists - Rename title');
            } else {
              Utils.showAlert(ev, 'Error saving document');
            }
          });
        };

        // Update shared roles array
        $scope.toggle = function(item, list) {
          var role = list.indexOf(item);
          if (role > -1) {
            list.splice(role, 1);
          } else {
            list.push(item);
          }
        };

        $scope.isSelected = function(role) {
          var checked = $scope.doc ?
            $scope.doc.roles.indexOf(role._id) > -1 : false;
          return checked;
        };

        // Cancel create document, return to dashboard
        $scope.upState = function() {
          $state.go('^');
        };

        $scope.init();

      }

    ]);
})();
