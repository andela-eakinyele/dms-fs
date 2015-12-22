(function() {
  "use strict";
  var apiTest = require("./specMod");
  var agent = apiTest.agent;
  var assert = require("assert");
  var _ = require("lodash");
  var mock = apiTest.seed;
  var data = apiTest.testdata;
  var docKeys = ["documentName", "title", "content", "role"];

  module.exports = function() {

    describe("Document CRUD\n", function() {
      var token = {};
      var usersId = {};
      var docId = {};
      var seededId = [];

      describe("Valid and authenticate users can create documents", function() {
        // document route requires authentication
        it("Should require a login/access_token", function(done) {
          var docdata = mock.parseData(docKeys, data.testDocs.doc1);
          agent
            .post("/dmsapi/documents")
            .set({
              "Accept": "application/json",
              "username": data.seedUsers.teamLead[2]
            })
            .type("json")
            .send(docdata)
            .expect("Content-Type", /json/)
            .expect(400)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              var response = res.body;
              assert.equal(response.message, "Invalid Token or Key");
              assert.equal(undefined, response.data);
              done();
            });
        });

        ["teamLead", "seniorDev"].forEach(function(key) {
          var user = {
            username: data.seedUsers[key][2],
            password: data.seedUsers[key][3]
          };
          it("Should return a token on Successful login", function(done) {
            agent
              .post("/dmsapi/users/login")
              .type("json")
              .send(user)
              .expect("Content-Type", /json/)
              .expect(200)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                var response = res.body;
                usersId[key] = response.user;
                token[key] = response.token;
                assert(response.token, "Token not generated");
                assert.equal(typeof response.expires, "number");
                assert.equal(response.user.username, user.username);
                done();
              });
          });
        });
        // logged in user should be able to create documents
        ["doc1", "doc2"].forEach(function(key) {
          it("Users should be able to create documents", function(done) {
            var docdata = mock.parseData(docKeys, data.testDocs[key]);
            agent
              .post("/dmsapi/documents")
              .set({
                "Accept": "application/json",
                "access_token": token.teamLead,
                "username": data.seedUsers.teamLead[2]
              })
              .type("json")
              .send(docdata)
              .expect("Content-Type", /json/)
              .expect(201)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                var response = res.body;
                docId[key] = response.data._id;
                assert.equal(response.message, "Created new Documents");
                assert.equal(response.data.documentName, data.testDocs[key][0]);
                done();
              });
          });
        });
      });

      // testing role access
      describe("Users with role defined in document", function() {
        before(function(done) {
          mock.docMock(_.values(data.seedDocs)).then(function(docs) {
            seededId = _.pluck(_.pluck(docs, "data"), "_id");
            done();
          });
        });
        // users with role defined should be able to get, and update document
        it("-Should be able to get document", function(done) {
          agent
            .get("/dmsapi/documents/" + docId.doc1)
            .set({
              "Accept": "application/json",
              "access_token": token.seniorDev,
              "username": data.seedUsers.seniorDev[2]
            })
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              var response = res.body;
              assert.equal(response.message, "Documents data:");
              assert.equal(response.data.documentName, "Lorems.js");
              done();
            });
        });

        it("-Should be able to update document with access", function(done) {
          var docdata = mock.parseData(docKeys, data.testDocs.doc1);
          docdata.documentName = "Lorem Ipsum.js";
          agent
            .put("/dmsapi/documents/" + docId.doc1)
            .set({
              "Accept": "application/json",
              "access_token": token.seniorDev,
              "username": data.seedUsers.seniorDev[2]
            })
            .send(docdata)
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              var response = res.body;
              assert.equal(response.message, "Updated Documents");
              assert.equal(response.data.documentName, "Lorem Ipsum.js");
              done();
            });
        });

        it("-Should not be able to update document" +
          " without role access",
          function(done) {
            var docdata = mock.parseData(docKeys, data.testDocs.doc2);
            docdata.documentName = "Hardware Softies.js";
            agent
              .put("/dmsapi/documents/" + docId.doc2)
              .set({
                "Accept": "application/json",
                "access_token": token.seniorDev,
                "username": data.seedUsers.seniorDev[2]
              })
              .send(docdata)
              .expect("Content-Type", /json/)
              .expect(403)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                var response = res.body;
                assert.equal(response.message, "Not authorized to edit document");
                assert.equal(response.data, "");
                done();
              });
          });
        // should return all docs owned by user
        it("-Should be able to get document by userid", function(done) {
          agent
            .get("/dmsapi/users/" + usersId.teamLead._id + "/documents")
            .set({
              "Accept": "application/json",
              "access_token": token.teamLead,
              "username": data.seedUsers.teamLead[2]
            })
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              var response = res.body;
              assert.equal(response.message, "Document for id " +
                usersId.teamLead._id);
              assert.equal(response.data.length, 3);
              assert.deepEqual(_.pluck(response.data, "documentName"), ["Lorem " +
                "Ipsum.js", "Staples.json", "Clothes.doc"
              ]);
              done();
            });
        });

        // should be able to delete document with only role access and ownerId
        it("-Should be able to delete own document", function(done) {
          agent
            .delete("/dmsapi/documents/" + seededId[1])
            .set({
              "Accept": "application/json",
              "access_token": token.teamLead,
              "username": data.seedUsers.teamLead[2]
            })
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              var response = res.body;
              assert.equal(response.message, "Removed Documents");
              assert.equal(response.data._id, seededId[1]);
              done();
            });
        });
        //  should not able to get all document
        it("-Should not be able to retrieve all " +
          "documents at once",
          function(done) {
            agent
              .get("/dmsapi/documents/")
              .set({
                "Accept": "application/json",
                "access_token": token.teamLead,
                "username": data.seedUsers.teamLead[2]
              })
              .type("json")
              .expect("Content-Type", /json/)
              .expect(403)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                var response = res.body;
                assert.equal(response.message, "Not authorized");
                assert.equal(response.error, "Unauthorized user");
                done();
              });
          });
        //  should not be able to delete documents shared with others
        it("-Should not be able to delete shared document " +
          "owned by others",
          function(done) {
            agent
              .delete("/dmsapi/documents/" + seededId[0])
              .set({
                "Accept": "application/json",
                "access_token": token.teamLead,
                "username": data.seedUsers.teamLead[2]
              })
              .expect("Content-Type", /json/)
              .expect(403)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                var response = res.body;
                assert.equal(response.message, "Not authorized " +
                  "to delete document");
                assert.equal(response.data, "");
                done();
              });
          });
        //  should not be able to delete doucments owned by others
        it("-Should not be able to delete own shared document",
          function(done) {
            agent
              .delete("/dmsapi/documents/" + docId.doc1)
              .set({
                "Accept": "application/json",
                "access_token": token.teamLead,
                "username": data.seedUsers.teamLead[2]
              })
              .expect("Content-Type", /json/)
              .expect(403)
              .end(function(err, res) {
                if (err) {
                  return done(err);
                }
                var response = res.body;
                assert.equal(response.message, "Not authorized " +
                  "to delete document");
                assert.equal(response.data, "");
                done();
              });
          });
      });
    });

  };
})();
