var express=require('express');
var router=express.Router({mergeParams: true});;
var methodOverride=require("method-override");
router.use(methodOverride("_method"));
var Employee=require('../models/Employee_Schema.js');

// Landing Page
router.get("/",function(req,res){
		console.log(" Root ! ");
		Employee.find({},function(err,emp_data){
			if(err)
				console.log("Cannot Find in DB");
			else
				res.render("./employee/landing.ejs",{emp_data:emp_data});
		});
});

// // Form Post route redirected to /EMPLOYEE
router.post("/",function(req,res){
	console.log(" Root2 ! ");	
		var name=req.body.name;
		var url=req.body.image;
		var age=req.body.age;
		var salary=req.body.salary;
		var post=req.body.post;
		var description=req.body.description;
		// var user=req.user.username;
		// var userID=req.user._id;
		var new_emp_object={    name	   : name,
							    image      : url,
							    age        : age,
							    salary     : salary,
							    post       : post,
							    description: description 
							 };
		Employee.create(new_emp_object,function(err,data){
		   if(err)
			   console.log("Couldnt create data in DB");
		   else
		   {
			   console.log(data);
			   res.redirect("/employee");}
	   });

});

// 	Form page for new data
router.get("/new",function(req,res){
		console.log("reached adding !!");
		res.render("./employee/new_emp.ejs");
});

// Show Info of employee by ID
router.get("/:id",function(req,res){
	console.log("info of id "+req.params.id);
	Employee.findById(req.params.id,function(err,data){
		if(err)
			console.log(err);
		else
			res.render("./employee/info.ejs",{data:data});
	});	
});

// Edit employee details
router.get("/:id/edit",function(req,res){
	Employee.findById(req.params.id,function(err,imp_data){
		if(err)
			console.log(err);
		else
			res.render("./employee/edit.ejs",{imp_id:req.params.id, imp_data:imp_data});	
		});
});
// Update Employee details
router.put("/:id",function(req,res){
	console.log("employee put");
	var name=req.body.name;
	var url=req.body.image;
	var age	=req.body.age;
	var salary	=req.body.salary;
	var post	=req.body.post;
	var description=req.body.description;
	var new_imp_object={    name	   : name,
							image      : url,
							age        : age,
							salary     : salary,
							post       : post,
							description: description 
	 };
	Employee.findByIdAndUpdate(req.params.id,new_imp_object,function(err,data){
	if(err)
		console.log("Couldnt Create data in DB");
	else
		res.redirect("/employee/"+req.params.id);
	});
});

// DELETE employee details
router.get("/:id/delete",function(req,res){
	console.log("OWNERSHIP GOT");
	Employee.findByIdAndRemove(req.params.id,function(err){
		if(err)
			console.log(err);
		else
			res.redirect("/employee");
	});
});

module.exports=router;