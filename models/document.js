var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var documentSchema = new Schema({
  _id: {
    type: Number,
    min: 100,
    required: true,
    default: 100,
    unique: true
  },
  ownerId: [{
    type: Number,
    ref: "Users"
  }],
  documentName: {
    type: String,
    required: (true, "Document name is invalid")
  },
  title: {
    type: String,
    required: (true, "title is invalid")
  },
  content: {
    type: String,
    required: (true, "content is invalid")
  },
  role: [{
    type: Number,
    ref: "Roles"
  }],
  dateCreated: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  strict: true
});

documentSchema.statics.getMaxId = function () {
  var query = this.find({}, "_id");
  return new Promise(function (resolve, reject) {
    query.then(function (ids) {
        resolve(ids);
      },
      function (err) {
        reject(Error(err));
      });
  });
};

module.exports = mongoose.model("Documents", documentSchema);