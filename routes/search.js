var express = require("express");
var router  = express.Router();
var Tech = require("../models/tech");
var middleware = require("../middleware");


//INDEX - show all techs
router.post("/", function(req, res){
    // Get all techs from DB
    var item = req.body.itemName;
    var category = req.body.category;
    if (category === 'Choose...') category = '';
    if (item==='' && category==='') {
        Tech.find({}, function(err, allTechs){
           if(err){
               console.log(err);
           } else {
                // console.log('allTechs: ' + allTechs);
                res.render("searches/index",{techs:allTechs, item: item, isadmin: req.session.isadmin, category: category});
           }
        });
    } else {
        Tech.find({
            $or:[
                {category: category},
                {name: item}
            ]
        }, function(err, allTechs){
           if(err){
               console.log(err);
           } else {
                // console.log('allTechs: ' + allTechs);
                res.render("searches/index",{techs:allTechs, item: item, isadmin: req.session.isadmin, category: category});
           }
        });
    }
});


module.exports = router;

