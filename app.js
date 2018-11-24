var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Tech  = require("./models/tech"),
    Wishlist = require("./models/wishlist"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    techRoutes = require("./routes/techs"),
    indexRoutes      = require("./routes/index"),
    wishlistRoutes  = require("./routes/wishlist"),
    searchRoutes  = require("./routes/search")
    
 
var url = process.env.DATABASEURL || "mongodb://localhost/tech5";
mongoose.connect(url);

//app.use( express.static( "public" ) );
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/techs", techRoutes);
app.use("/techs/:id/comments", commentRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/search",searchRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Online Tech Store Server Has Started!");
});