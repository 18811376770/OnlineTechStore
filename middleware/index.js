var Tech = require("../models/tech");
var Comment = require("../models/comment");
var express = require("express")
var ejs = require('ejs')
var app = express()
var path = require('path')
var multer = require('multer')
// all the middleare goes here
var middlewareObj = {};

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/images');
	},
	filename: function(req, file, callback) {
		console.log(file);
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

middlewareObj.upload = function(req, res, next) {
	var upload = multer({
		storage: storage
	}).single('userFile');
	upload(req, res, function(err) {});
	next();
}

middlewareObj.checkTechOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Tech.findById(req.params.id, function(err, foundTech){
           if(err){
               req.flash("error", "Tech not found");
               res.redirect("back");
           }  else {
               // does user own the tech?
            if(foundTech.author.id.equals(req.user._id) || req.user._id.equals("5a2365c5e4c3290b66f69ddb")) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;