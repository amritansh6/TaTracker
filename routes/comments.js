var express=require('express');
var router=express.Router({mergeParams: true});
var Campgrounds=require('../models/Campground_Schema.js');
var Comment=require('../models/comments.js'); 
var methodOverride=require("method-override");
router.use(methodOverride("_method"));
var middleware=require("../middleware/index.js");

//=======COMMENT SECTION==========================

// Form page for new comments
router.get("/new",middleware.isLoggedIn,function(req,res){
		var camp_id=req.params.id;
		res.render("./comments/new.ejs",{camp_id:camp_id});
});

// comments POST request
router.post("/",middleware.isLoggedIn,function(req,res){
		var camp_id=req.params.id;
		var text=req.body.comment_text;
		Campgrounds.findById(camp_id,function(err,campground_data){
			if(err)
				console.log(err);
			else
			{
				newcomment={
					comment:text,
					author:{ id:req.user._id  ,
					username:req.user.username}
					};

				Comment.create(newcomment, function(err,comment_data){
					if(err)
						console.log(err);
					else
						{
							campground_data.comments.push(comment_data);
							campground_data.save();
						}
		
					});
				console.log("camp data=======\n"+campground_data);
				campground_data.save(function(err){
					if(!err)
						res.redirect("/campgrounds/"+req.params.id);
					else
						console.log("Comment data unsaved\n");
				});
			}
		});

});

// console.log("camp id :  "+req.params.id);
// console.log("comment id :  "+req.params.id2);

// EDIT Comment
router.get("/:id2/edit",middleware.OwnershipAuthComment,function(req,res){
	Comment.findById(req.params.id2,function(err,comment_data){
		if(err)
			console.log(err);
		else
		{
			console.log(comment_data);
			res.render("./comments/edit.ejs",{comment_data:comment_data, camp_id:req.params.id});
		}

	});
});
// UPDATE Comment
router.post("/:id2/edit",middleware.OwnershipAuthComment,function(req,res){
	updated_comment={comment:req.body.comment}
	console.log(updated_comment);
	Comment.findByIdAndUpdate(req.params.id2,updated_comment,function(err,comment_data){
		if(err)
			console.log(err);
		else{
			console.log("NEW COMMENT:  "+comment_data);
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});
// DELETE Comment
router.get("/:id2/delete",middleware.OwnershipAuthPlusCampAdminDeleteRights,function(req,res){
	console.log("OWNERSHIP GOT");
	Comment.findByIdAndRemove(req.params.id2,function(err){
		if(err)
			console.log(err);
		else
			res.redirect("/campgrounds/"+req.params.id);
		});
});

//MIDDLEWARE
/*function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};*/
/*function OwnershipAuth(req,res,next){
	if(req.isAuthenticated())
	{
		console.log("USER-AUTH DONE")
		Comment.findById(req.params.id2,function(err,comment_data){
			if(err)
				res.redirect("back");
			else if(req.user._id.equals(comment_data.author.id))
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
/*function OwnershipAuthPlusCampAdminDeleteRights(req,res,next){
	if(req.isAuthenticated())
	{
		console.log("USER-AUTH DONE")
		Comment.findById(req.params.id2,function(err,comment_data){
			if(err)
				res.redirect("back");
			else if(req.user._id.equals(comment_data.author.id))
				next();
			else
			{
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
		});
	}
	else
	{
		req.flash("error","Please Login first !");
		res.redirect("back");
	}
}
*/// exporting router
module.exports=router;