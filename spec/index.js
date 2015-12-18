var initSpec = require("./initSpec");
var roleSpec = require("./roleSpec");
var userSpec = require("./userSpec");
var docSpec = require("./docSpec");
var adminSpec = require("./adminSpec");
var apiTest = require("./specMod");

describe("Testing API Routes", function () {
  after(function (done) {
    apiTest.seed.deleteModels(done);
  });
  initSpec();
  roleSpec();
  userSpec();
  docSpec();
  adminSpec();
});