var apiTest = require("./specMod");
var agent = apiTest.agent;
var assert = require("assert");
var mock = apiTest.seed;
var data = apiTest.testdata;
var userKeys = ["firstname", "lastname", "username",
  "password", "role", "email"
];

module.exports = function () {

  describe("Initialization of API\n", function () {
    beforeEach(function (done) {
      mock.deleteModels(done);
    });
    // should respond to root route
    it("- API should respond to root", function (done) {
      agent
        .get("/dmsapi/")
        .set("Accept", "application/json")
        .expect(200, {
          "message": "Welcome to the Document Management System"
        }, done);
    });
    // Should enforce creating Admin user first
    it("- Should require Admin User account be created first", function (done) {
      var userdata = mock.parseData(userKeys, data.testUsers.teamLead);
      agent
        .post("/dmsapi/users")
        .type("json")
        .send(userdata)
        .expect(400)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          var response = res.body;
          assert.equal(response.message, "Create Admin User " +
            "-role:Admin", "Admin user required");
          done();
        });
    });
    // create user and persist to database
    it("- Should persist a valid Admin user to database", function (done) {
      var userdata = mock.parseData(userKeys, data.testUsers.admin);
      agent
        .post("/dmsapi/users")
        .type("json")
        .send(userdata)
        .expect(201)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          var response = res.body;
          assert.equal(response.message, "Created new Users");
          assert.equal(response.data.username + " " + 
            response.data.email, "EAbbott eabbott@project.com");
          done();
        });
    });
  });
};