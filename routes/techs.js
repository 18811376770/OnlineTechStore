var express = require("express");
var router  = express.Router();
var Tech = require("../models/tech");
var middleware = require("../middleware");
var multer  = require("multer");
var path = require('path');



router.get("/", function(req, res){
    console.log("req.query.isadmin:" + req.query.isadmin);
    console.log("req.session.isadmin:" + req.session.isadmin)
    var perPage = 4;
    var page = req.query.page || 1;

    Tech
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, allTechs){  
            if(err){
                console.log(err);
            } else {
                Tech.count().exec(function(err, count) {
                    if(err){
                        console.log(err);
                    } else {
                        res.render("techs/index",{techs:allTechs, current: page, pages: Math.ceil(count / perPage), isadmin:req.session.isadmin});
                    }
                });
            }
        });
});
var filename = "";

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/images');
	},
	filename: function(req, file, callback) {
		console.log(file);
		filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
		callback(null, filename);
	}
});
//INDEX - show all filtered techs
router.get("/filter", function(req, res){
    // Get all techs from DB
    Tech.find({}, function(err, allTechs){
       if(err){
           console.log(err);
       } else {
          res.render("techs/filter",{techs:allTechs, isadmin:req.session.isadmin});
       }
    });
});

//CREATE - add new tech to DB
    var upload = multer({
		storage: storage
	}).single('userFile');
	
router.post("/",middleware.isLoggedIn, upload, function(req, res){
    // get data from form and add to techs array
    var name = req.body.name;
    var price = req.body.price;
    var quantity = req.body.quantity;
    var category = req.body.category;
    // console.log('category: ' + category)
    var image = null;
    if(filename == null || filename.length == 0){
        image = req.body.image;
    }else{
        image = "/images/" + filename;
        filename = null;
    }
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var display = true;
    var newTech = {name: name, price: price, quantity: quantity, image: image, description: desc, author:author, category: category, display: display}
    // Create a new tech and save to DB
    Tech.create(newTech, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to techs page
            // console.log(newlyCreated);
            res.redirect("/techs");
        }
    });
});



//NEW - show form to create new tech
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("techs/new"); 
});

// SHOW - shows more info about one tech
router.get("/:id", function(req, res){
    //find the tech with provided ID
    Tech.findById(req.params.id).populate("comments").exec(function(err, foundTech){
        if(err){
            console.log(err);
        } else {
            // console.log(foundTech)
            //render show template with that tech
            res.render("techs/show", {tech: foundTech, isadmin: req.session.isadmin});
        }
    });
});

// EDIT TECH ROUTE
router.get("/:id/edit", function(req, res){
    Tech.findById(req.params.id, function(err, foundTech){
        res.render("techs/edit", {tech: foundTech});
    });
});

// Delete tech
router.get("/:id/delete", function(req, res){
    Tech.findByIdAndUpdate (req.params.id, {display: false}, function(err){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/techs/" + req.params.id);
        }
    });
})

// Recover tech
router.get("/:id/recover", function(req, res){
    Tech.findByIdAndUpdate (req.params.id, {display: true}, function(err){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/techs/" + req.params.id);
        }
    });
})

// UPDATE TECH ROUTE
router.put("/:id", upload, function(req, res){
    // find and update the correct tech
    var name = req.body.name;
    var price = req.body.price;
    var quantity = req.body.quantity;
    var image = null;
    if(filename == null || filename.length == 0){
        image = req.body.image;
    }else{
        image = "/images/" + filename;
        filename = null;
    }
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var upTech = {name: name, price: price, quantity: quantity, image: image, description: desc, author:author};
    Tech.findByIdAndUpdate(req.params.id, upTech, function(err, updatedTech){
       if(err){
           res.redirect("/techs");
       } else {
           // console.log(updatedTech);
           //redirect somewhere(show page)
           res.redirect("/techs/" + req.params.id);
       }
    });
});



module.exports = router;

