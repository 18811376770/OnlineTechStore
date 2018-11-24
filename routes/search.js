var express = require("express");
var router  = express.Router();
var Tech = require("../models/tech");
var middleware = require("../middleware");


//INDEX - show all techs
router.post("/", function(req, res){
    // Get all techs from DB
    var item = req.body.itemName;
    Tech.find({}, function(err, allTechs){
       if(err){
           console.log(err);
       } else {
          res.render("searches/index",{techs:allTechs, item: item});
       }
    });
});


module.exports = router;

