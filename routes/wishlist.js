var express = require("express");
var router  = express.Router();
var Tech = require("../models/tech");
var User = require("../models/user");
var Wishlist = require("../models/wishlist");
var middleware = require("../middleware");


//INDEX - show all techs
router.get("/", middleware.isLoggedIn, function(req, res){
    // Get all techs from DB
    Wishlist.find({belong: req.user.username}, function(err, allWishlists){
       if(err){
           console.log(err);
       } else {
          res.render("wishlists/index",{techs:allWishlists});
       }
    });
});


router.get("/:id", function(req, res){
    //find the tech with provided ID
    Tech.findById(req.params.id).populate("comments").exec(function(err, foundTech){
        if(err){
            console.log(err);
        } else {
            var name = foundTech.name;
            var price = foundTech.price;
            var quantity = foundTech.quantity;
            var image = foundTech.image;
            var desc = foundTech.description;
            var author = {
                id: foundTech.author._id,
                username: foundTech.author.username
            }
            var belong = req.user.username;
            console.log(belong);
            var newWishlist = {name: name, price: price, quantity: quantity, image: image, description: desc, author:author, belong : belong}
            // Create a new wishlist and save to DB
            Wishlist.create(newWishlist, function(err, newlyCreated){
                if(err){
                    console.log(err);
                } else {
                    console.log(newlyCreated);
                    res.redirect("/wishlist");
                }
            });
        }
    });
});

router.delete("/:id",function(req, res){
  Wishlist.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/wishlist");
      } else {
          res.redirect("/wishlist");
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
