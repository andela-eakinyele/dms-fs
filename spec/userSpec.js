var apiTest = require("./specMod");
var agent = apiTest.agent;
var assert = require("assert");
var _ = require("lodash");
var mock = apiTest.seed;
var data = apiTest.testdata;
var uKeys = ["firstname", "lastname", "username", "password", "role", "email"];
var mKeys = ["name.first", "name.last", "username", "password", 
"role", "email"];

module.exports = function () {
  // seed roles and users
  describe("Non- admin users CRUD", function () {
    var testuserData = "";
    var userData = "";
    var token = "";
    var usersId = "";

    before(function (done) {
      mock.roleMock(data.seedRoles)
        .then(function () {
          mock.userMock(data.seedUsers)
            .then(function (users) {
              userData = _.pluck(users, "data");
              usersId = _.pluck(userData, "_id");
              done();
            }).catch(function (err) {
              console.log("Error mocking users", err);
              return;
            });
        }).catch(function (err) {
          console.log("Error mocking roles", err);
          return;
        });
    });

    describe("Persisting non- admin users to the database", function () {
      it("Should persist a valid non-admin userdata" +
        " to database",
        function (done) {
          var userdata = mock.parseData(uKeys, data.testUsers.PM);
          agent
            .post("/dmsapi/users")
            .type("json")
            .send(userdata)
            .expect(200)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              var response = res.body;
              testuserData = response.data;
              assert(response.status, "User not Created");
              assert.equal(response.message, "Created new Users");
              assert.equal(response.data.username + " " +
                response.data.email, "HAhmed hahmed@project.com");
              done();
            });
        });

      ["username", "email"].forEach(function (unique) {
        it("Should throw validation error for duplicate data: " +
          unique,
          function (done) {
            var userdata = mock.parseData(uKeys, data.testUsers.PM);
            if (unique === "username") {
              userdata.email = "hahmed123@project.com";
            } // duplicate username
            if (unique === "email") {
              userdata.username = "HAhmed123";
            } // duplicate email
            agent
              .post("/dmsapi/users")
              .type("json")
              .send(userdata)
              .expect(200)
              .end(function (err, res) {
                if (err) {
                  return done(err);
                }
                var response = res.body;
                assert.notEqual(true, response.status);
                assert.equal(response.message, "Users already exist \n " +
                  "Change unique data");
                done();
              });
          });
      });

      uKeys.forEach(function (key, index) {
        // check email, username, firstname, passsword, empty or invalid role
        it("Should throw error for invalid userdata: " + key, function (done) {
          var userdata = mock.parseData(uKeys, data.invalidTest.invalidData);
          delete userdata[key];
          agent
            .post("/dmsapi/users")
            .type("json")
            .send(userdata)
            .expect(200)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              var response = res.body;
              assert.notEqual(true, response.status, "User was Created");
              if (key === "role") {
                assert.equal(response.message, "Invalid role specified" +
                  " \"undefined\" does not exist");
              } else {
                var invalid = _.keys(response.error.error.errors);
                assert.equal(response.error.message, "Error creating" +
                  " undefined Users");
                assert.equal(response.error.error.message, "Users " +
                  "validation failed");
                assert.deepEqual(invalid, [mKeys[index]]);
              }
              done();
            });
        });
      });
    });

    describe("Persisted non-admin users - retrieve and update", function () {
      var username = "HAhmed",
        password = "hahmed";
      // users should be logged in before crud
      it("Should require a login/access_token for" +
        " retrieve or update",
        function (done) {
          agent
            .get("/dmsapi/users/" + usersId[0])
            .type("json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              var response = res.body;
              assert.notEqual(true, response.status);
              assert.equal(response.message, "Invalid Token or Key");
              assert.equal(undefined, response.data);
              done();
            });
        });
      // invalid username or password
      ["username", "password"].forEach(function (args) {
        it("Should validate username and password - Invalid " +
          args,
          function (done) {
            if (args === "username") {
              username = "HAhmed123";
            } // invalid username
            if (args === "password") {
              password = "HAhmed123";
            } // invalid password
            agent
              .post("/dmsapi/users/login")
              .type("json")
              .send({
                username: username,
                password: password
              })
              .expect("Content-Type", /json/)
              .expect(200)
              .end(function (err, res) {
                if (err) {
                  return done(err);
                }
                var response = res.body;
                assert.notEqual(true, response.status, "User is valid");
                assert.equal(response.message, "Invalid credentials");
                assert.equal(undefined, response.token, "Token was generated");
                done();
              });
          });
      });

      // successful login and token 
      it("Should return a token on Successful login", function (done) {
        agent
          .post("/dmsapi/users/login")
          .type("json")
          .send({
            username: testuserData.username,
            password: testuserData.password
          })
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var response = res.body;
            token = response.token;
            assert(response.token, "Token not generated");
            assert.equal(typeof response.expires, "number");
            assert.equal(response.user.username, "HAhmed");
            done();
          });
      });
      // retrieve any user data 
      it("Should retrieve any user data one at a time", function (done) {
        agent
          .get("/dmsapi/users/" + usersId[0])
          .set({
            username: testuserData.username,
            access_token: token
          })
          .type("json")
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var response = res.body;
            assert(response.status, "id/route is invalid");
            assert.equal(response.message, "Users data:");
            assert.equal(usersId[0], response.data._id);
            done();
          });
      });
      // should not be able to retrieve all user data
      it("Should not be able to retrieve all" +
        " user data at once",
        function (done) {
          agent
            .get("/dmsapi/users/")
            .set({
              username: testuserData.username,
              access_token: token
            })
            .type("json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }
              var response = res.body;
              assert.notEqual(true, response.status, "Non-admin " +
                " user has access");
              assert.equal(response.message, "Not authorized");
              assert.equal(response.error, "Unauthorized user");
              done();
            });
        });
      // update own user data
      it("Should be able to update own data", function (done) {
        var userdata = mock.parseData(uKeys, data.testUsers.PM);
        userdata.username = "HAhmed_Love";
        agent
          .put("/dmsapi/users/" + testuserData._id)
          .set({
            username: testuserData.username,
            access_token: token
          })
          .type("json")
          .send(userdata)
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var response = res.body;
            assert(response.status, "User not updated");
            assert.equal(response.message, "Updated Users");
            assert.equal(response.data.username, "HAhmed_Love");
            testuserData.username = response.data.username;
            done();
          });
      });
      // should not be able to update other user data
      it("Should not be able to update other users data", function (done) {
        var userdata = {};
        userdata.role = "Trainee";
        ["name", "username", "password", "role", "email"]
        .forEach(function (key) {
          if (key !== "role") {
            userdata[key] = userData[0][key];
          }
        });
        agent
          .put("/dmsapi/users/" + 101)
          .set({
            username: testuserData.username,
            access_token: token
          })
          .type("json")
          .send(userdata)
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var response = res.body;
            assert.notEqual(true, response.status, "User was updated");
            assert.equal(response.message, "Not authorized to update user");
            done();
          });
      });

      it("Should not be able to create admin user", function (done) {
        var userdata = mock.parseData(uKeys, data.testUsers.admin2);
        agent
          .post("/dmsapi/users")
          .set({
            username: testuserData.username,
            access_token: token
          })
          .type("json")
          .send(userdata)
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var response = res.body;
            assert.notEqual(true, response.status, "Admin user was added");
            assert.equal(response.message, "Not authorized " +
              "to create Admin user");
            assert.equal(response.error, "Unauthorized user action");
            done();
          });
      });

      it("Should be able to create non-admin user", function (done) {
        var userdata = mock.parseData(uKeys, data.testUsers.DPM);
        agent
          .post("/dmsapi/users")
          .set({
            username: testuserData.username,
            access_token: token
          })
          .type("json")
          .send(userdata)
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var response = res.body;
            assert(response.status, "Non-admin user was not added");
            assert.equal(response.message, "Created new Users");
            assert.equal(response.data.username + " " +
              response.data.email, "MSims msims@project.com");
            done();
          });
      });
      // should not be able to delete own userdata
      it("Should not be able to delete own data", function (done) {
        agent
          .delete("/dmsapi/users/" + testuserData._id)
          .set({
            username: testuserData.username,
            access_token: token
          })
          .type("json")
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var response = res.body;
            assert.notEqual(true, response.status, "User deleted");
            assert.equal(response.message, "Not authorized");
            assert.equal(response.error, "Unauthorized user");
            done();
          });
      });
      // should not be able to delete other user data
      it("Should not be able to delete other users data", function (done) {
        agent
          .delete("/dmsapi/users/" + 101)
          .set({
            username: testuserData.username,
            access_token: token
          })
          .type("json")
          .expect("Content-Type", /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var response = res.body;
            assert.notEqual(true, response.status, "User deleted");
            assert.equal(response.message, "Not authorized");
            assert.equal(response.error, "Unauthorized user");
            done();
          });
      });
    });
  });
};