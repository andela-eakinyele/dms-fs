(function() {
  'use strict';
  var _ = require('lodash');
  var apiTest = require('./specVar');
  var assert = require('assert');
  var agent = apiTest.agent;
  var data = apiTest.testdata;
  module.exports = function() {

    describe('Admin User CRUD role', function() {
      var token = '';
      var user = {
        username: 'EAbbott',
        password: 'eabbott'
      };
      var roleId = '';
      // role route requires authentication and validation
      it('Should require a login/access_token for Role CRUD', function(done) {
        agent
          .post('/api/roles')
          .type('json')
          .send({
            'title': data.testRole
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
            token = response.token;
            assert(response.token, 'Token not generated');
            assert.equal(typeof response.expires, 'number');
            assert.equal(response.user.username, 'EAbbott');
            done();
          });
      });
      // admin should create roles
      it('Admin should be able to create roles', function(done) {
        agent
          .post('/api/roles')
          .set({
            'Accept': 'application/json',
            'access_token': token,
            'username': user.username
          })
          .type('json')
          .send({
            'title': data.testRole
          })
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            roleId = response.data._id;
            assert.equal(response.message, 'Created new Roles');
            assert.equal(response.data.title, 'Project Manager');
            done();
          });
      });
      // admin should get roles
      it('Admin should be able to retrieve roles', function(done) {
        agent
          .get('/api/roles/' + roleId)
          .set({
            'Accept': 'application/json',
            'access_token': token,
            'username': user.username
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.message, 'Roles data:');
            assert.equal(response.data.title, 'Project Manager');
            done();
          });
      });
      // admin should retrieve all roles
      it('Admin should be able to retrieve all roles', function(done) {
        agent
          .get('/api/roles')
          .set({
            'Accept': 'application/json',
            'access_token': token,
            'username': user.username
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.message, 'Existing Roles');
            assert.deepEqual(_.pluck(response.data, 'title'), ['Admin',
              'Project Manager'
            ]);
            done();
          });
      });
      // admin should update roles
      it('Admin should be able to update roles', function(done) {
        agent
          .put('/api/roles/' + roleId)
          .set({
            'Accept': 'application/json',
            'access_token': token,
            'username': user.username
          })
          .type('json')
          .send({
            'title': 'Package Manager'
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.message, 'Updated Roles');
            assert.equal(response.data.title, 'Package Manager');
            done();
          });
      });
      // Admin should be able to delete roles
      it('Admin should be able to delete roles', function(done) {
        agent
          .delete('/api/roles/' + roleId)
          .set({
            'Accept': 'application/json',
            'access_token': token,
            'username': user.username
          })
          .type('json')
          .send({
            'title': 'Package Manager'
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.message, 'Removed Roles');
            assert.equal(response.data.title, 'Package Manager');
            done();
          });
      });
    });
  };
})();
