var express = require("express");
var router  = express.Router();
var Tech = require("../models/tech");
var User = require("../models/user");
var Order = require("../models/order");
var middleware = require("../middleware");


//INDEX - show all orders
router.get("/", middleware.isLoggedIn, function(req, res){
    // Get all orders from DB
    Order.find({belong: req.user.username}, function(err, allOrders){
       if(err){
           console.log(err);
       } else {
          res.render("orders/index",{techs:allOrders});
       }
    });
});

module.exports = router;