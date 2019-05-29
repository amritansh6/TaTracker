 var express=require('express');
var app=express();
// used for req.body 
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
// for authentication
var passport=require('passport');
var LocalStrategy=require('passport-local');
var flash=require('connect-flash');
// mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true },function(err,db){
// 	if(err)
// 		console.log(err);
// 	else
// 		console.log("Connected to DB");
// });
var request=require('request');
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));

//Require Comments Module
var Comment=require('./models/comments.js'); 

//Require Campgrounud Schema
var Campgrounds=require("./models/Campground_Schema.js");

// User Schema
var User=require('./models/user.js'); 
// var middleware=require("../middleware/index.js");

// Shortened Routes codes Required
var  commentRoutes=require('./routes/comments.js');
var  campgroundRoutes=require('./routes/campgrounds.js');
var  indexRoutes=require('./routes/index.js');

//==========================================

// PASSPORT CONFGI
app.use(require("express-session")({
	secret:"NEWHASHKEY",
	resave:false,
	saveUninitialized:false
}))	;
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.userDetails=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});
//__dirname is whole directory name  
app.use(express.static(__dirname + "/public"));

//================================================
app.get("/",function(req,res){
	console.log("ROOT REACHED!");
	res.render("cover.ejs");
});


//Refactored routes use

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

// Server Listing IP and Port
app.listen(process.env.PORT,process.env.IP,function(){
	console.log("Server On !!");
});