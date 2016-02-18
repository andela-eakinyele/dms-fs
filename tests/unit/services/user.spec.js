// describe('User Service', function() {
//   var UserService,
//     httpBackend;

//   beforeEach(function() {
//     // load the module.
//     module('prodocs');
//   });

//   // get your service, also get $httpBackend
//   beforeEach(inject(function($injector) {
//     UserService = $injector.get('Users');
//     httpBackend = $injector.get('$httpBackend');
//   }));

//   afterEach(function() {
//     httpBackend.verifyNoOutstandingExpectation();
//     httpBackend.verifyNoOutstandingRequest();
//   });

//   it('should request all users endpoint', function() {

//     httpBackend.expectGET('/api/users/1').respond([]);

//     httpBackend.flush();


//   });

//   it('should respond', function() {
//     var returnedPromise = UserService.get('/api/users/1');
//     // set up a handler for the response, that will put the result
//     // into a variable in this scope for you to test.
//     var result;
//     returnedPromise.then(function(response) {
//       result = response;
//     });
//     // flush the backend to "execute" the request to do the expectedGET assertion.
//     httpBackend.flush();
//     expect(result).toEqual(returnData);

//     var returnData = {
//       username: 'test',
//       _id: 1,
//       users: [],
//       roles: []
//     };
//   });

// });
