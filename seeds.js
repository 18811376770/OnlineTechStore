var mongoose = require("mongoose");
var Tech = require("./models/tech");
var Comment   = require("./models/comment");


function seedDB(){
   //Remove all techs
   Tech.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed techs!");
    }); 
}

module.exports = seedDB;