var express=require('express');
var router=express.Router({mergeParams: true});;
var methodOverride=require("method-override");
var flash=require('connect-flash');
router.use(flash());
router.use(methodOverride("_method"));
var Campgrounds=require('../models/Campground_Schema.js');
var middleware=require("../middleware");

// Landing Page
router.get("/",function(req,res){
		console.log("campgrounds !!");	
		console.log(middleware.check);
		Campgrounds.find({},function(err,camp_data){
			if(err)
				console.log("Cannot Find in DB");
			else
				res.render("./campground/landing.ejs",{camp_data:camp_data, userDetails:req.user});
		});
});

// Form Post route redirected to /campgrounds
router.post("/",middleware.isLoggedIn,function(req,res){
	 var name=req.body.name;
	 var url=req.body.image;
	 var description=req.body.description;
	 var user=req.user.username;
	 var userID=req.user._id;
	 var new_camp_object={ name:name,
	 					   image:url,
	 					   description:description,
	 					   author:{	
	 					   			id:userID,
	 					   			username:user
	 					   		  }
	 					 };
	 Campgrounds.create(new_camp_object,function(err,data){
		if(err)
			console.log("Couldnt Create data in DB");
		else
		{
			console.log(data);
			res.redirect("/campgrounds");}
	});
});

// 	Form page for new data
router.get("/new",middleware.isLoggedIn,function(req,res){
		console.log("reached adding !!");
		res.render("./campground/newcampgrounds.ejs",{userDetails:req.user});
});

// Show Info of CampSite by ID
router.get("/:id",function(req,res){
	var t=Campgrounds.findById(req.params.id).populate("comments").exec();
	console.log("t  is ==\t"+t+"\n");
	Campgrounds.findById(req.params.id).populate("comments").exec(function(err,data){
		if(err)
			console.log(err);
		else
		{
			// console	.log("printing details====\n "+data);
			res.render("./campground/info.ejs",{data:data, userDetails:req.user, camp_id:req.params.id});
		}

	});
});


// Edit CampSite details
router.get("/:id/edit",middleware.OwnershipAuth,function(req,res){
	Campgrounds.findById(req.params.id,function(err,camp_data){
	if(err)
		console.log(err);
	else
		res.render("./campground/edit.ejs",{camp_id:req.params.id, camp_data:camp_data});	
	});
});
// Update CampSite details
router.put("/:id",middleware.OwnershipAuth,function(req,res){
	var name=req.body.name;
	var url=req.body.image;
	var description=req.body.description;
	var new_camp_object={ name:name,image:url,description:description};
	Campgrounds.findByIdAndUpdate(req.params.id,new_camp_object,function(err,data){
		if(err)
			console.log("Couldnt Create data in DB");
		else
			res.redirect("/campgrounds/"+req.params.id);
		});
	});
// DELETE CampSite details
router.get("/:id/delete",middleware.OwnershipAuth,function(req,res){
	console.log("OWNERSHIP GOT")
	Campgrounds.findByIdAndRemove(req.params.id,function(err){
		if(err)
			console.log(err);
		else
			res.redirect("/campgrounds");
		});
	});


//MIDDLEWARE
/*function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login first !");
	res.redirect("/login");
};
function OwnershipAuth(req,res,next){
	if(req.isAuthenticated())
	{
		console.log("USER-AUTH DONE")
		Campgrounds.findById(req.params.id,function(err,camp_data){
			if(err)
				res.redirect("back");
			else if(req.user._id.equals(camp_data.author.id))
				next();
			else
			{
				req.flash("error","You are not authorized to perform this task");
				res.redirect("back");
			}
		});
	}
	else
	{
		req.flash("error","Please Login first !");
		res.redirect("back");
	}
}*/
// exporting router
module.exports=router;