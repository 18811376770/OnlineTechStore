var express = require("express");
var router  = express.Router();
var Tech = require("../models/tech");
var User = require("../models/user");
var Order = require("../models/order");
var Shoppingcart = require("../models/shoppingcart")
var middleware = require("../middleware");


//INDEX - show all orders
router.get("/", middleware.isLoggedIn, function(req, res){
    // Get all orders from DB
    Order.find({belong: req.user.username}, function(err, allOrders){
       if(err){
           console.log(err);
       } else {
          res.render("orders/index",{orders: allOrders});
       }
    });
});

// create new order
router.get("/new", middleware.isLoggedIn, function(req, res){
    Shoppingcart.find({belong: req.user.username}, function (err, allTechs) {
        if(err) {
            console.log(err);
        } else {
            var images = [];
            var items = [];
            var quantities = [];
            var sum = 0;
            allTechs.forEach(function(Tech){
                images.push(Tech.image);
                items.push(Tech.name);
                quantities.push(Tech.quantity);
                sum += Tech.price * Tech.quantity;
            })
            var belong = req.user.username;
            var date = new Date();
            // console.log(date);
            var belong = req.user.username;
            var newOrder = {images: images, items: items, quantities: quantities, sum: sum, time: date, belong: belong};
            Order.create(newOrder, function(err, newCreated){
                if(err) {
                    console.log(err);
                } else {
                    res.redirect("/order");
                }
            })
            Shoppingcart.remove({belong: req.user.username}, function(err){
                if (err){
                    console.log(err);
                }
            })
            var size = items.length;
            // var temp = [];
            for (var i = 0; i < size; i++){
                var temp = 0 - quantities[i];
                Tech.update({name: items[i]}, {$inc: {quantity: temp}}, function(err){
                    if(err) {
                        console.log(err);
                    }
                    // } else {
                    //     var temp = quantities.shift() - tech.quantity;
                    //     var name = items.shift();
                    //     console.log('quantity: '+ temp);
                    //     console.log('name: '+name);
                    //     Tech.update({name: name}, {quantity: temp}, function(err){
                    //         if (err) console.log(err);
                    //     })
                    // }
                })
            }
            // for (var j = 0; j < size; j++) {
            //     var newQuantity = temp[j] - quantities[j];
            //     console.log('newQuantity' + newQuantity);
            //     Tech.update({name: items[i]}, {quantity: newQuantity}, function(err){
            //         if (err) console.log(err);
            //     })
            // }
        }
      })
})

module.exports = router;