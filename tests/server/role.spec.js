(function() {
  'use strict';
  var _ = require('lodash');
  var apiTest = require('./specVar');
  var assert = require('assert');
  var agent = apiTest.agent;
  var roleSeed = apiTest.testdata.roles;
  var userSeed = apiTest.testdata.users;

  module.exports = function() {

    describe('Admin User CRUD role', function() {
      var token, testRole, adminUser,
        user = {
          username: userSeed.groupUsers.tuser2[2],
          password: userSeed.groupUsers.tuser2[3]
        };
      // role route requires authentication and validation
      it('Should require a login/access_token for Role CRUD', function(done) {
        agent
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
        agent
          .post('/api/users/login')
          .type('json')
          .send(user)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            adminUser = response.user;
            token = response.token;
            assert(response.token, 'Token not generated');
            assert.equal(typeof response.expires, 'number');
            assert.equal(response.user.username, 'EAbbott');
            done();
          });
      });

      // group admin user create roles
      it('- Should be able to create roles for valid group', function(done) {
        agent
          .post('/api/roles')
          .type('json')
          .set({
            userid: adminUser._id,
            access_token: token,
            groupid: 113
          })
          .send({
            title: roleSeed.testRole,
            groupId: 113
          })
          .expect(201)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            testRole = response.data;
            assert.equal(response.message, 'Created new Roles');
            assert.equal(testRole.title, 'Manager');
            assert.deepEqual(testRole.groupId, [113]);
            done();
          });
      });

      it('- Should rollback roles for invalid group', function(done) {
        agent
          .post('/api/roles')
          .type('json')
          .set({
            userid: adminUser._id,
            access_token: token,
            groupid: 113
          })
          .send({
            title: 'New Role',
            groupId: 600
          })
          .expect(400)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.message, 'Invalid Group');
            done();
          });
      });

      it('- Should be able to update roles for group', function(done) {
        agent
          .put('/api/roles/' + testRole._id)
          .type('json')
          .set({
            userid: adminUser._id,
            access_token: token,
            groupid: 113
          })
          .send({
            title: 'Librarian',
            groupId: 113
          })
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.message, 'Updated Roles');
            assert.equal(response.data.title, 'Librarian');
            assert.deepEqual(response.data.groupId, [113]);
            done();
          });
      });

      it('- Should be able to get all roles', function(done) {
        agent
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
            assert.equal(response.message, 'Existing Roles');
            assert.deepEqual(_.pluck(response.data, 'title'), ['Admin',
              'Librarian'
            ]);
            done();
          });
      });


      it('- Should be able to get a role', function(done) {
        agent
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
            assert.equal(response.message, 'Roles data:');
            assert.equal(response.data.title, 'Librarian');
            done();
          });
      });

      it('- Should be able to delete a role', function(done) {
        agent
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
            assert.equal(response.message, 'Removed Roles');
            assert.equal(response.data.title, 'Librarian');
            done();
          });
      });
    });

  };
})();
