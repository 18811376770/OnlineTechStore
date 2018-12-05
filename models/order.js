var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
   items:[],
   quantities:[],
   images: [],
   time: Date,
   sum: String,
   belong: String
});

module.exports = mongoose.model("Order", orderSchema);