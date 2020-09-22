var express=require('express');
var router=express.Router({mergeParams: true});;
var methodOverride=require("method-override");
var passport=require('passport');
var flash=require('connect-flash');

// ==============_ Model+MiddleWare _=================
var Course      = require("../models/Course.js");
var Professor   = require('../models/Professor.js'); 
var Student     = require("../models/Student.js");
var Assistant   = require('../models/Assistant.js'); 
var middleware  = require("../middleware/index.js");
// ==============ROUTER CONFIg=========================
router.use(methodOverride("_method"));
router.use(flash());


// ===============_ API's _============================

//-------------Register GET----------------------------
router.get("/register",function(req,res){
	res.render("register.ejs");
});

//-------------Register POST---------------------------
router.post("/register",function(req,res){
	console.log("registered");
	var userPassword=req.body.password;
	var Type=req.body.type;
	if(Type === "Professor"){
		var newUser=new Professor({username:req.body.username});
		Professor.register(newUser,userPassword,function(err,user){
			if(err){
				console.log(err);
				req.flash("error",err);
				return res.render("register.ejs");
			}
			passport.authenticate('professLocal')(req,res,function(){
				res.redirect("/course");
			});
	
		});
	}
	else if(Type === "Student"){
		var newUser=new Student({username:req.body.username});
		Student.register(newUser,userPassword,function(err,user){
			if(err){
				console.log(err);
				req.flash("error",err);
				return res.render("register.ejs");
			}
			passport.authenticate('stuLocal')(req,res,function(){
				res.redirect("/course");
			});
		});
	}
	else{
		var newUser=new Assistant({username:req.body.username});
		Assistant.register(newUser,userPassword,function(err,user){
			if(err){
				console.log(err);
				req.flash("error",err);
				return res.render("register.ejs");
			}
			passport.authenticate('assistLocal')(req,res,function(){
				res.redirect("/course");
			});
		});
	}
	 
});


//-------------Login GET----------------------------
router.get("/login",function(req,res){
	res.render("login.ejs");
	console.log("log get");
});

//-------------Login POST---------------------------
router.post("/login",passport.authenticate(['professLocal', 'stuLocal', 'assistLocal'], 
{ 
	failureFlash: 'Invalid username or password.',
	failureRedirect: '/login',
}),
	function(req,res){
		console.log(req.user._id.toString());
		if(req.user._id.toString() && req.user._id.toString().length>0)
			{
				req.flash("success","You are successfully logged in");
				res.redirect("/course");
			}

		else
		{
			console.log("FAILED LOGIN ATTEMPT");
			req.flash("error","Please log in first");
			res.redirect("/login");
		}
});

//-------------Logout GET----------------------------
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You are logged out");
	res.redirect("/course");
});

module.exports=router;