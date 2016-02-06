var table = document.querySelector('table');
var headerCheckbox = table.querySelector('thead .mdl-data-table__select input');
var boxes = table.querySelectorAll('tbody .mdl-data-table__select');
var headerCheckHandler = function(event) {
  if (event.target.checked) {
    for (var i = 0, length = boxes.length; i < length; i++) {
      boxes[i].MaterialCheckbox.check();
    }
  } else {
    for (var i = 0, length = boxes.length; i < length; i++) {
      boxes[i].MaterialCheckbox.uncheck();
    }
  }
};
headerCheckbox.addEventListener('change', headerCheckHandler);



var config = require("./config"),
  mongoose = require("mongoose");

var connectionString = process.env.DEBUG === "true" ?
  config.debug.database.connectionString :
  config.database.connectionString;

mongoose.connect(connectionString);

mongoose.connection.on("connected", function() {
  console.log("Connected to " + connectionString);
});

mongoose.connection.on("error", function(error) {
  console.log("Connection to " + connectionString + " failed:" + error);
});

mongoose.connection.on("disconnected", function() {
  console.log("Disconnected from " + connectionString);
});

process.on("SIGINT", function() {
  mongoose.connection.close(function() {
    console.log("Disconnected from " + connectionString + " through app termination");
    process.exit(0);
  });
});


var config = {
  database: {
    connectionString: "mongodb://localhost:27017/schemasample",
    databaseName: "schemasample"
  },
  debug: {
    database: {
      connectionString: "mongodb://localhost:27017/schemasample-dev",
      databaseName: "schemasample-dev"
    }
  }
};

module.exports = config;
