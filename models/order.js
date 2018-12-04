var mongoose = require("mongoose");

var techSchema = new mongoose.Schema({
   items:[],
   quantities:[],
   images: [],
   time: Date,
   sum: String,
  //  author: {
  //     id: {
  //        type: mongoose.Schema.Types.ObjectId,
  //        ref: "User"
  //     },
  //     username: String
  //  },
   belong: String
});

module.exports = mongoose.model("Order", techSchema);