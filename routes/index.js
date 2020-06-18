var express=require('express');
var router=express.Router({mergeParams: true});;
var methodOverride=require("method-override");
var passport=require('passport');
var User=require("../models/user.js");
var flash=require('connect-flash');

var Employee=require('../models/Employee_Schema.js');
var Notification	=require('../models/Notification.js');
var middleware=require("../middleware/index.js");

router.use(methodOverride("_method"));
router.use(flash());

router.get("/register",function(req,res){
	res.render("register.ejs");
});
// POST register
router.post("/register",function(req,res){
	console.log("registered");
	var newUser=new User({username:req.body.username});
	var userPassword=req.body.password;
	User.register(newUser,userPassword,function(err,user){
		if(err){
			console.log(err);
			return res.render("register.ejs");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/employee");
		});

	});
});


// Login Page
router.get("/login",function(req,res){
	res.render("login.ejs");
	console.log("log get");
});
// POST Login_Credentials
router.post("/login",passport.authenticate("local"),
	function(req,res){
		console.log(req.user._id.toString());
		
			if(req.user._id.toString() && req.user._id.toString().length>0)
				{
					req.flash("success","You are successfully logged in");
				res.redirect("/employee");
				}

			else
			{
				req.flash("error","Please log in first");
				res.redirect("/login");
			}
		// }
});

// LOGOUT
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You are logged out");
	res.redirect("/employee");
});

// view notificaton
router.get("/notifications",async function(req,res){
	try{
		let user = await User.findById(req.user._id).populate({
			path: 'notifications'
		}).exec();
		let allNotificatons = user.notificatons;
		console.log(allNotificatons);
		res.render('notificationIndex.ejs', {allNotifications:allNotifications });
		}catch(err) {
			req.flash('error', err.message);
			res.redirect('back');
		}
});

// handle notificaton
router.get("/notifications/:id",async function(req,res){
	try{
		console.log("notification wiht ID");
		Notification.findByIdAndUpdate(req.params.id,{isRead:true},function(err,data){
			if(err)
				console.log(err);
			else
				res.redirect("/employee/"+data.employeeId);
		});
		}catch(err) {
			req.flash('error', err.message);
			res.redirect('back');
		}
});



/*function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};
*/
// exporting router
module.exports=router;