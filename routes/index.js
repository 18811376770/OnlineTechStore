var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    if(req.body.username.length == 0 || req.body.password.length == 0 ) {
        req.flash("error", "Both blanks should be filled!");
        res.redirect("/register"); 
    }else if (req.body.password.length < 8){
        req.flash("error", "The password's length should greater or equal to 8");
        res.redirect("/register"); 
    }else{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("/register"); 
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Online Tech Store " + user.username);
           res.redirect("/techs"); 
        });
    });
    }
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/techs",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/techs");
});



module.exports = router;