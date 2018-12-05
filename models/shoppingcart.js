var mongoose = require("mongoose");

var cartSchema = new mongoose.Schema({
   name: String,
   price: String,
   quantity: Number,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   belong: String
});

module.exports = mongoose.model("Shoppingcart", cartSchema);