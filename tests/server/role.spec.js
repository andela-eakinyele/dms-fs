(function() {
  'use strict';
  var _ = require('lodash');
  var apiTest = require('./specVar')();
  var assert = require('assert');
  var request = apiTest.request;
  var roleSeed = apiTest.testdata.roles;
  var userSeed = apiTest.testdata.users;

  module.exports = function() {

    var token = '';
    var testRole = '';
    var adminUser = '';
    var user = {
      username: userSeed.groupUsers.tuser2[2],
      password: userSeed.groupUsers.tuser2[3]
    };
    describe('Admin User CRUD role', function() {

      // role route requires authentication and validation
      it('Should require a login/access_token for Role CRUD', function(done) {
        request
          .post('/api/roles')
          .type('json')
          .send({
            'title': roleSeed.testRole,
            groupId: 113
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.message, 'Invalid Token or Key');
            assert.equal(undefined, response.data);
            done();
          });
      });
      // verify admin login
      it('Should return a token on Successful login', function(done) {
        request
          .post('/api/users/login')
          .type('json')
          .send(user)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            adminUser = response.data.user;
            token = response.data.token;
            assert(token, 'Token not generated');
            assert.equal(typeof response.data.expires, 'number');
            assert.equal(response.data.user.username, 'EAbbott');
            done();
          });
      });

      // group admin user create roles
      it('- Should be able to create roles for valid group', function(done) {
        request
          .post('/api/roles')
          .type('json')
          .set({
            userid: adminUser._id,
            access_token: token,
            groupid: 113
          })
          .send([{
            title: roleSeed.testRole,
            groupId: 113
          }])
          .expect(201)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            testRole = response.ops[0];
            assert.equal(testRole.title, 'Manager');
            assert.deepEqual(testRole.groupId, 113);
            done();
          });
      });

      it('- Should be able to update roles for group', function(done) {
        request
          .put('/api/roles/' + testRole._id)
          .type('json')
          .set({
            userid: adminUser._id,
            access_token: token,
            groupid: 113
          })
          .send({
            title: 'Librarian',
            groupId: [113]
          })
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.title, 'Librarian');
            assert.deepEqual(response.groupId, [113]);
            done();
          });
      });

      it('- Should be able to get all roles', function(done) {
        request
          .get('/api/roles')
          .type('json')
          .set({
            userid: adminUser._id,
            access_token: token,
            groupid: 113
          })
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.deepEqual(_.pluck(response, 'title'), ['Admin',
              'Librarian'
            ]);
            done();
          });
      });


      it('- Should be able to get a role', function(done) {
        request
          .get('/api/roles/' + testRole._id)
          .type('json')
          .set({
            userid: adminUser._id,
            access_token: token,
            groupid: 113
          })
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.title, 'Librarian');
            done();
          });
      });

      it('- Should be able to delete a role', function(done) {
        request
          .delete('/api/roles/' + testRole._id)
          .type('json')
          .set({
            userid: adminUser._id,
            access_token: token,
            groupid: 113
          })
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.title, 'Librarian');
            done();
          });
      });

    });

  };
})();
