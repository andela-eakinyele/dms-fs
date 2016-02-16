// describe('SignupCtrl tests', function() {
//   'use strict';
//   var scope,
//     Users = {
//       login: function(user, cb) {
//         if (user === 'superAdmin') {
//           cb(!user, {
//             data: {}
//             user: {
//               name: 3,
//               _id: 1
//             }
//             groupId: [],
//             roles: [{
//               title: 'superAdmin',
//               _id: 2
//             }]
//           });
//         } else if (user === 'testUser') {
//           cb(!user, {
//             data: {
//               user: {
//                 name: 3,
//                 _id: 1
//               }
//               groupId: [{
//                 _id: 1
//               }]
//             }
//           });
//         } else if (user === 'newUser') {
//           cb(!user, {
//             data: {}
//             user: {
//               name: 3,
//               _id: 1
//             }
//             groupId: [],
//             roles: []
//           });
//         } else if (!user) {
//           cb(!user, false);
//         }
//       },
//       save: function(user, cb, cbb) {
//         cb(user);
//         cbb({
//           data: {
//             error: 'this is bad'
//           }
//         });
//       }
//     },
//     state,
//     Auth,
//     controller;

//   beforeEach(function() {
//     module('prodocs');
//   });


//   beforeEach(inject(function($injector) {
//     var $controller = $injector.get('$controller');
//     scope = $injector.get('$rootScope');
//     controller = $controller('LoginCtrl', {
//       $scope: scope,
//       Users: Users
//     });
//     Auth = $injector.get('Auth');
//     state = $injector.get('$state');
//   }));

//   it('should call the save function in the Users service', function() {
//     spyOn(Users, 'save').and.callThrough();
//     spyOn(Auth, 'setToken');
//     spyOn(state, 'go');
//     scope.user = {
//       passwordSignup: 'Password1234',
//       confirmPassword: 'Password1234'
//     };
//     scope.signup();
//     expect(Users.save).toHaveBeenCalled();
//     expect(Auth.setToken).toHaveBeenCalled();
//     expect(state.go).toHaveBeenCalled();
//     expect(scope.currentUser).toBeDefined();
//   });

// });
