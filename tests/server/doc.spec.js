(function() {
  'use strict';
  var apiTest = require('./specVar')();
  var request = apiTest.request;
  var assert = require('assert');
  var _ = require('lodash');
  var mock = apiTest.seed;
  var data = apiTest.testdata.docs;
  var userSeed = apiTest.testdata.users;
  var roleSeed = apiTest.testdata.roles;

  var keys = ['label', 'title', 'content', 'groupId', 'ownerId', 'roles'];
  var ckey = ['label', 'title', 'content', 'roles'];

  var rKey = ['title', 'groupId'];
  var uKey = ['name.first', 'name.last', 'username', 'password',
    'email'
  ];

  module.exports = function() {

    describe('Document CRUD\n', function() {
      var token = [];
      var userData = [];
      var userIds = [];
      var docData = [];
      var docIds = [];
      var roleData = [];
      var roleIds = [];
      var testDoc = '';

      describe('Valid and authenticate users can create documents', function() {


        before(function(done) {
          // seed roles
          mock.seedCreate(apiTest.model.role, rKey,
            roleSeed.seedRoles, 3).then(function(roles) {
            roleData = roles;
            roleIds = _.pluck(roles, '_id');

            // seed users and add role
            mock.seedCreate(apiTest.model.user, uKey,
              userSeed.docUsers, 203).then(function(users) {
              userData = users;
              userData = _.map(userData, function(user, index) {
                user.roles.push(roleIds[index % 2]);
                user.groupId.push(113);
                return user;
              });
              // mock updated user data
              mock.seedUpdate(apiTest.model.user, userData)
                .then(function(updated) {
                  userData = updated;
                  userIds = _.pluck(updated, '_id');

                  mock.seedCreate(apiTest.model.doc, keys,
                      data.seedDocs, 100)
                    .then(function(docs) {
                      docData = docs;
                      docIds = _.pluck(docs, '_id');
                      done();
                    }).catch(function(err) {
                      console.log('Error mocking docs', err);
                      return;
                    });
                }).catch(function(err) {
                  console.log('Error updating users', err);
                  return;
                });
            }).catch(function(err) {
              console.log('Error mocking users', err);
              return;
            });
          }).catch(function(err) {
            console.log('Error creating docs', err);
            return;
          });
        });


        // document route requires authentication
        it('Should require a login/access_token', function(done) {
          var docdata = mock.parseData(ckey, data.testDocs);
          request
            .post('/api/documents')
            .set({
              'Accept': 'application/json',
              'username': userSeed.docUsers.tuser3[2],
              'password': userSeed.docUsers.tuser3[3],
              groupid: 113,
              userid: 203
            })
            .type('json')
            .send(docdata)
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

        it('Should return a token on Successful login', function(done) {
          var user = {
            'Accept': 'application/json',
            'username': userSeed.docUsers.tuser3[2],
            'password': userSeed.docUsers.tuser3[3]
          };

          request
            .post('/api/users/login')
            .type('json')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              token.push(response.data);
              assert(response.data.token, 'Token not generated');
              assert.equal(typeof response.data.expires, 'number');
              assert.equal(response.data.user.username, user.username);
              done();
            });
        });

        it('Should return a token on Successful login', function(done) {
          var user = {
            'Accept': 'application/json',
            'username': userSeed.docUsers.tuser4[2],
            'password': userSeed.docUsers.tuser4[3]
          };

          request
            .post('/api/users/login')
            .type('json')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              token.push(response.data);
              assert(response.data.token, 'Token not generated');
              assert.equal(typeof response.data.expires, 'number');
              assert.equal(response.data.user.username, user.username);
              done();
            });
        });

        // logged in user should be able to create documents
        it('Users should be able to create documents', function(done) {
          var docdata = mock.parseData(ckey, data.testDocs);
          request
            .post('/api/documents')
            .set({
              'Accept': 'application/json',
              'username': userSeed.docUsers.tuser3[2],
              'password': userSeed.docUsers.tuser3[3],
              groupid: 113,
              userid: userIds[0],
              access_token: token[0].token
            })
            .type('json')
            .send(docdata)
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              testDoc = response;
              assert.equal(response.label, data.testDocs[0]);
              done();
            });
        });

      });
      // testing role access
      describe('Users with role defined in document', function() {
        // users with role defined should be able to get, and update document
        it('-Should be able to get document', function(done) {
          request
            .get('/api/documents/' + docIds[0])
            .set({
              'username': userSeed.docUsers.tuser3[2],
              'password': userSeed.docUsers.tuser3[3],
              groupid: 113,
              userid: userIds[1],
              access_token: token[1].token
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.title, 'Staple Foods');
              done();
            });
        });

        // should return not exist for invalid document
        it('- Should not find invalid document', function(done) {
          request
            .get('/api/documents/' + 600)
            .set({
              'username': userSeed.docUsers.tuser3[2],
              'password': userSeed.docUsers.tuser3[3],
              groupid: 113,
              userid: userIds[1],
              access_token: token[1].token
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(0, response.length, 'Document was retrieved');
              done();
            });
        });

        // should return all docs owned by user
        it('-Should be able to get document by userid', function(done) {
          request
            .get('/api/users/' + userIds[0] + '/documents')
            .set({
              'username': userSeed.docUsers.tuser3[2],
              'password': userSeed.docUsers.tuser3[3],
              groupid: 113,
              userid: userIds[0],
              access_token: token[0].token
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.length, 3);
              assert.deepEqual(_.pluck(response,
                'title'), ['Staple Foods', 'Life of a developer', 'Lorem Ipsum']);
              done();
            });
        });

        // should be able to update document 
        it('-Should be able to update own document', function(done) {
          request
            .put('/api/documents/' + docIds[1])
            .set({
              'username': userSeed.docUsers.tuser3[2],
              'password': userSeed.docUsers.tuser3[3],
              groupid: 113,
              userid: userIds[0],
              access_token: token[0].token
            })
            .send({

            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response._id, docIds[1]);
              done();
            });
        });
        // should be able to delete document with only role access and ownerId
        it('-Should be able to delete own document', function(done) {
          request
            .delete('/api/documents/' + docIds[1])
            .set({
              'username': userSeed.docUsers.tuser3[2],
              'password': userSeed.docUsers.tuser3[3],
              groupid: 113,
              userid: userIds[0],
              access_token: token[0].token
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response._id, docIds[1]);
              done();
            });
        });

        //  should not be able to delete documents shared with others
        it('-Should not be able to delete shared document ' +
          'owned by others',
          function(done) {
            request
              .delete('/api/documents/' + docIds[0])
              .set({
                'username': userSeed.docUsers.tuser3[2],
                'password': userSeed.docUsers.tuser3[3],
                groupid: 113,
                userid: userIds[0],
                access_token: token[0].token
              })
              .expect('Content-Type', /json/)
              .expect(403)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Not authorized ' +
                  'to delete document');
                assert.equal(response.data, '');
                done();
              });
          });

        //  should not be able to delete doucments owned by others
        it('-Should not be able to delete own shared document',
          function(done) {
            request
              .delete('/api/documents/' + docIds[2])
              .set({
                'username': userSeed.docUsers.tuser3[2],
                'password': userSeed.docUsers.tuser3[3],
                groupid: 113,
                userid: userIds[0],
                access_token: token[0].token
              })
              .expect('Content-Type', /json/)
              .expect(403)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Not authorized ' +
                  'to delete document');
                assert.equal(response.data, '');
                done();
              });
          });
      });

    });

  };
})();
