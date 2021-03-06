var express = require("express");
var router  = express.Router();
var Tech = require("../models/tech");
var User = require("../models/user");
var Shoppingcart = require("../models/shoppingcart");
var middleware = require("../middleware");


//INDEX - show all techs
router.get("/", middleware.isLoggedIn, function(req, res){
    // Get all techs from DB
    Shoppingcart.find({belong: req.user.username}, function(err, allTechs){
        var checkStore = {}; 
       if(err){
           console.log(err);
       } else {
            Tech.find({}, function(err, store){
                if (err) {
                    console.log(err);
                } else {
                    store.forEach(function(item){
                        checkStore[item.name] = item.quantity;
                    })
                    res.render("shoppingcart/index",{techs:allTechs, checkStore:checkStore});
                }
            })
       }
    });
});


router.get("/:id", middleware.isLoggedIn, function(req, res){
    //find the tech with provided ID
    Tech.findById(req.params.id).populate("comments").exec(function(err, foundTech){
        if(err){
            console.log(err);
        } else {
            var name = foundTech.name;
            var price = foundTech.price;
            var quantity = 1;
            var image = foundTech.image;
            var desc = foundTech.description;
            var author = {
                id: foundTech.author._id,
                username: foundTech.author.username
            }
            var belong = req.user.username;
            // console.log(belong);
            var newShoppingcart = {name: name, price: price, quantity: quantity, image: image, description: desc, author:author, belong : belong}
            // Create a new wishlist and save to DB
            Shoppingcart.create(newShoppingcart, function(err, newlyCreated){
                if(err){
                    console.log(err);
                } else {
                    // console.log(newlyCreated);
                    res.redirect("/shoppingcart");
                }
            });
        }
    });
});

// update items in shopping cart
router.get("/:id/quantityPlus", function(req, res){

    Shoppingcart.findById(req.params.id, function(err, tech){
        if(err){
            res.redirect("/shoppingcart");
        } else {
            var quantity = tech.quantity;
            tech.quantity = quantity + 1;
            tech.save(function (err, updatedTech) {
                if (err) res.redirect("/shoppingcart");
                res.redirect("/shoppingcart");
            });
        }
    })
});

router.get("/:id/quantityMinus", function(req, res){

    Shoppingcart.findById(req.params.id, function(err, tech){
        if(err){
            res.redirect("/shoppingcart");
        } else {
            var quantity = tech.quantity;
            tech.quantity = quantity - 1;
            tech.save(function (err, updatedTech) {
                if (err) res.redirect("/shoppingcart");
                res.redirect("/shoppingcart");
            });
        }
    })
});



router.delete("/:id",function(req, res){
  Shoppingcart.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/shoppingcart");
      } else {
          res.redirect("/shoppingcart");
      }
  });
});

// //CREATE - add new tech to DB
// router.post("/", middleware.isLoggedIn, function(req, res){
//     // get data from form and add to techs array
//     var name = req.body.name;
//     var price = req.body.price;
//     var quantity = req.body.quantity;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     var newTech = {name: name, price: price, quantity: quantity, image: image, description: desc, author:author}
//     // Create a new tech and save to DB
//     Tech.create(newTech, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             //redirect back to techs page
//             console.log(newlyCreated);
//             res.redirect("/techs");
//         }
//     });
// });

// //NEW - show form to create new tech
// router.get("/new", middleware.isLoggedIn, function(req, res){
//   res.render("techs/new"); 
// });

// // SHOW - shows more info about one tech
// router.get("/:id", function(req, res){
//     //find the tech with provided ID
//     Tech.findById(req.params.id).populate("comments").exec(function(err, foundTech){
//         if(err){
//             console.log(err);
//         } else {
//             console.log(foundTech)
//             //render show template with that tech
//             res.render("techs/show", {tech: foundTech});
//         }
//     });
// });

// // EDIT CAMPGROUND ROUTE
// router.get("/:id/edit", middleware.checkTechOwnership, function(req, res){
//     Tech.findById(req.params.id, function(err, foundTech){
//         res.render("techs/edit", {tech: foundTech});
//     });
// });

// // UPDATE CAMPGROUND ROUTE
// router.put("/:id",middleware.checkTechOwnership, function(req, res){
//     // find and update the correct tech
//     Tech.findByIdAndUpdate(req.params.id, req.body.tech, function(err, updatedTech){
//       if(err){
//           res.redirect("/techs");
//       } else {
//           //redirect somewhere(show page)
//           res.redirect("/techs/" + req.params.id);
//       }
//     });
// });

// DESTROY CAMPGROUND ROUTE
// router.delete("/:id",middleware.checkTechOwnership, function(req, res){
//   Tech.findByIdAndRemove(req.params.id, function(err){
//       if(err){
//           res.redirect("/techs");
//       } else {
//           res.redirect("/techs");
//       }
//   });
// });


module.exports = router;
