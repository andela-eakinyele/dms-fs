(function() {
  'use strict';
  var apiTest = require('./specMod');
  var agent = apiTest.agent;
  var assert = require('assert');
  var _ = require('lodash');
  var mock = apiTest.seed;
  var data = apiTest.testdata;
  var docKeys = ['documentName', 'title', 'content', 'role'];

  module.exports = function() {

    describe('Document CRUD\n', function() {
      var token = {};
      var usersId = {};
      var docId;
      var seededId = [];

      describe('Valid and authenticate users can create documents', function() {
        // document route requires authentication
        it('Should require a login/access_token', function(done) {
          var docdata = mock.parseData(docKeys, data.testDocs.doc1);
          agent
            .post('/api/documents')
            .set({
              'Accept': 'application/json',
              'username': data.seedUsers.teamLead[2]
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
            username: data.seedUsers.teamLead[2],
            password: data.seedUsers.teamLead[3]
          };
          agent
            .post('/api/users/login')
            .type('json')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              usersId.teamLead = response.user;
              token.teamLead = response.token;
              assert(response.token, 'Token not generated');
              assert.equal(typeof response.expires, 'number');
              assert.equal(response.user.username, user.username);
              done();
            });
        });

        it('Should return a token on Successful login', function(done) {
          var user = {
            username: data.seedUsers.seniorDev[2],
            password: data.seedUsers.seniorDev[3]
          };
          agent
            .post('/api/users/login')
            .type('json')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              usersId.seniorDev = response.user;
              token.seniorDev = response.token;
              assert(response.token, 'Token not generated');
              assert.equal(typeof response.expires, 'number');
              assert.equal(response.user.username, user.username);
              done();
            });
        });

        // logged in user should be able to create documents
        it('Users should be able to create documents', function(done) {
          var docdata = mock.parseData(docKeys, data.testDocs);
          agent
            .post('/api/documents')
            .set({
              'Accept': 'application/json',
              'access_token': token.teamLead,
              'username': data.seedUsers.teamLead[2]
            })
            .type('json')
            .send(docdata)
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              docId = response.data._id;
              assert.equal(response.message, 'Created new Documents');
              assert.equal(response.data.documentName, data.testDocs[0]);
              done();
            });
        });

        it('Users should not be able to create documents' +
          ' with invalid file type',
          function(done) {
            var docdata = mock.parseData(docKeys, data.invalidTest.invalidFile);
            agent
              .post('/api/documents')
              .set({
                'Accept': 'application/json',
                'access_token': token.teamLead,
                'username': data.seedUsers.teamLead[2]
              })
              .type('json')
              .send(docdata)
              .expect('Content-Type', /json/)
              .expect(406)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Invalid file type');
                done();
              });
          });

        it('Users should not be able to create documents' +
          ' with invalid role',
          function(done) {
            var docdata = mock.parseData(docKeys, data.invalidTest.invalidRole);
            agent
              .post('/api/documents')
              .set({
                'Accept': 'application/json',
                'access_token': token.teamLead,
                'username': data.seedUsers.teamLead[2]
              })
              .type('json')
              .send(docdata)
              .expect('Content-Type', /json/)
              .expect(406)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Invalid User/Role ' +
                  'specified \'' + data.seedUsers.teamLead[2] +
                  '/' + docdata.role + '\' does not exist');
                done();
              });
          });
      });

      // testing role access
      describe('Users with role defined in document', function() {
        before(function(done) {
          mock.docMock(_.values(data.seedDocs)).then(function(docs) {
            seededId = _.pluck(_.pluck(docs, 'data'), '_id');
            done();
          });
        });
        // users with role defined should be able to get, and update document
        it('-Should be able to get document', function(done) {
          agent
            .get('/api/documents/' + docId)
            .set({
              'Accept': 'application/json',
              'access_token': token.seniorDev,
              'username': data.seedUsers.seniorDev[2]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.message, 'Documents data:');
              assert.equal(response.data.documentName, 'Lorems.js');
              done();
            });
        });

        // should return not exist for invalid user
        it('- Should not find invalid document', function(done) {
          agent
            .get('/api/documents/600')
            .set({
              'Accept': 'application/json',
              'access_token': token.seniorDev,
              'username': data.seedUsers.seniorDev[2]
            })
            .expect(400)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.message, 'Documents(s) do(es) not exist');
              assert.equal(0, response.data.length, 'Document was retrieved');
              done();
            });
        });

        it('-Should be able to update document with access', function(done) {
          var docdata = mock.parseData(docKeys, data.testDocs);
          docdata.documentName = 'Lorem Ipsum.js';
          agent
            .put('/api/documents/' + docId)
            .set({
              'Accept': 'application/json',
              'access_token': token.seniorDev,
              'username': data.seedUsers.seniorDev[2]
            })
            .send(docdata)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.message, 'Updated Documents');
              assert.equal(response.data.documentName, 'Lorem Ipsum.js');
              done();
            });
        });

        it('-Should not be able to update document with access' +
          ' with invalid role',
          function(done) {
            var docdata = mock.parseData(docKeys, data.invalidTest.update);
            docdata.documentName = 'Lorem Ipsums.js';
            agent
              .put('/api/documents/' + docId)
              .set({
                'Accept': 'application/json',
                'access_token': token.seniorDev,
                'username': data.seedUsers.seniorDev[2]
              })
              .send(docdata)
              .expect('Content-Type', /json/)
              .expect(406)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Invalid roles specified \'' +
                  docdata.role.join(',') + '\' does not exist');
                done();
              });
          });

        it('-Should not be able to update document' +
          ' without role access',
          function(done) {
            var docdata = mock.parseData(docKeys, data.seedDocs.doc2);
            docdata.documentName = 'Hardware Softies.js';
            agent
              .put('/api/documents/' + seededId[0])
              .set({
                'Accept': 'application/json',
                'access_token': token.seniorDev,
                'username': data.seedUsers.seniorDev[2]
              })
              .send(docdata)
              .expect('Content-Type', /json/)
              .expect(403)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message,
                  'Not authorized to edit document');
                assert.equal(response.data, '');
                done();
              });
          });

        // should return all docs owned by user
        it('-Should be able to get document by userid', function(done) {
          agent
            .get('/api/users/' + usersId.teamLead._id + '/documents')
            .set({
              'Accept': 'application/json',
              'access_token': token.teamLead,
              'username': data.seedUsers.teamLead[2]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.message, 'Document for id ' +
                usersId.teamLead._id);
              assert.equal(response.data.length, 3);
              assert.deepEqual(_.pluck(response.data,
                'documentName'), ['Lorem ' +
                'Ipsum.js', 'Staples.json', 'Clothes.doc'
              ]);
              done();
            });
        });

        // should be able to delete document with only role access and ownerId
        it('-Should be able to delete own document', function(done) {
          agent
            .delete('/api/documents/' + seededId[2])
            .set({
              'Accept': 'application/json',
              'access_token': token.teamLead,
              'username': data.seedUsers.teamLead[2]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.message, 'Removed Documents');
              assert.equal(response.data._id, seededId[2]);
              done();
            });
        });
        //  should not able to get all document
        it('-Should not be able to retrieve all ' +
          'documents at once',
          function(done) {
            agent
              .get('/api/documents/')
              .set({
                'Accept': 'application/json',
                'access_token': token.teamLead,
                'username': data.seedUsers.teamLead[2]
              })
              .type('json')
              .expect('Content-Type', /json/)
              .expect(403)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Not authorized');
                assert.equal(response.error, 'Unauthorized user');
                done();
              });
          });
        //  should not be able to delete documents shared with others
        it('-Should not be able to delete shared document ' +
          'owned by others',
          function(done) {
            agent
              .delete('/api/documents/' + seededId[0])
              .set({
                'Accept': 'application/json',
                'access_token': token.teamLead,
                'username': data.seedUsers.teamLead[2]
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
            agent
              .delete('/api/documents/' + docId)
              .set({
                'Accept': 'application/json',
                'access_token': token.teamLead,
                'username': data.seedUsers.teamLead[2]
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
