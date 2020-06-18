var express=require('express');
var router=express.Router({mergeParams: true});;
var methodOverride=require("method-override");

var passport=require('passport');
var User=require("../models/user.js");
var flash=require('connect-flash');

var Employee=require('../models/Employee_Schema.js');
var Notification=require('../models/Notification.js');
var middleware=require("../middleware/index.js");

router.use(methodOverride("_method"));
router.use(flash());

// Landing Page
router.get("/",middleware.isLoggedIn,function(req,res){
		console.log(" Root ! ");
		Employee.find({},function(err,emp_data){
			if(err)
				console.log("Cannot Find in DB");
			else
				res.render("./employee/landing.ejs",{emp_data:emp_data});
		});
});

// // Form Post route redirected to /EMPLOYEE
router.post("/",middleware.isLoggedIn,function(req,res){
	console.log(" Root2 ! ");	
		var name=req.body.name;
		var url=req.body.image;
		var age=req.body.age;
		var salary=req.body.salary;
		var post=req.body.post;
		var description=req.body.description;
		// var user=req.user.username;
		// var userID=req.user._id;
		var author = {
			id : req.user._id,
			username : req.user.username
		}
		var new_emp_object={    name	   : name,
							    image      : url,
							    age        : age,
							    salary     : salary,
							    post       : post,
								description: description,
								author	   : author
							 };
		Employee.create(new_emp_object,function(err,data){
		   if(err)
			   console.log("Couldnt create data in DB");
		   else
		   {
			//    console.log(data);
			   res.redirect("/employee");}
	   });

});

// // Form Post route redirected to /review
router.post("/:id/requestreview",middleware.isLoggedIn,middleware.OwnershipAuth,function(req,res){
	console.log(" review ! ");	
	let employee_id   = req.params.id;
	let employee_name   = req.body.employee_name;
	let reviewer      = req.body.selectUser;

	function findUsers() {
		return new Promise(function(resolve, reject) {
			User.find({},function(err,user_data){
			if(err)
			console.log("Cannotuser list  Find in DB");
			else
			resolve(user_data);
		});
	})
}
	function findEmployee() {
		return new Promise(function(resolve, reject) {
			Employee.findById(req.params.id,function(err,data){
				if(err)
				console.log(err);
				else
				resolve(data);
			});
		})
	}
	function createNotification(emp_data) {
		return new Promise(function(resolve, reject) {
			var new_notif={    
				username   : emp_data.author.username,
				employeeId : req.params.id,
				message    : "Request Review",
				isRead     :false
			};
			Notification.create(new_notif,function(err,data){
				if(err)
				console.log(err);
				else
				resolve(data);
			});
		})
	}

	function findUserandUpdate(emp_data, notif_data) {
		return new Promise(function(resolve, reject) {
			const filter = { username: reviewer };
			User.findOneAndUpdate(filter, {
				$push: {
					review: {
						$each: [emp_data ],
						$position: 0
					},
					notifications: {
						$each: [notif_data ],
						$position: 0
					}
				}
			}, {returnOriginal: false},function(err,data){
				if(err)
				console.log(err);
				else
				resolve(data);
			});
		});
	}
	async function updateReviewer() {
		var emp_data    = await findEmployee () ;
		// console.log("find employee "+emp_data);
		var notif_data  = await createNotification (emp_data) ;
		// console.log("created notification"+notif_data);
		var data        = await findUserandUpdate (emp_data, notif_data) ;
		console.log("added reviewer"+data);
		// var user_data    = await findUsers () ;
	}
	updateReviewer();
	res.redirect("/employee/"+req.params.id);
});


// 	Form page for new data
router.get("/new",middleware.isLoggedIn,function(req,res){
		console.log("reached adding !!");
		res.render("./employee/new_emp.ejs");
	});
	
	// Show Info of employee by ID
router.get("/:id",middleware.isLoggedIn,function(req,res){
		console.log("info of id "+req.params.id);
		
		function findEmployee() {
			return new Promise(function(resolve, reject) {
				Employee.findById(req.params.id,function(err,data){
					if(err)
					console.log(err);
					else
					resolve(data);
				});
			})
		}
		function findUsers() {
			return new Promise(function(resolve, reject) {
				User.find({},function(err,user_data){
				if(err)
				console.log("Cannotuser list  Find in DB");
				else
				resolve(user_data);
			});
		})
	}
	
	async function showInfo() {
		var user_data    = await findUsers () ;
		var emp_data    = await findEmployee () ;
		if(user_data !== undefined && user_data !== null && emp_data !== undefined && emp_data !== null ){
			res.render("./employee/info.ejs", {user_data:user_data, emp_data:emp_data});
		}
	}
	showInfo();
});

// Edit employee details
router.get("/:id/edit",middleware.isLoggedIn,function(req,res){
	Employee.findById(req.params.id,function(err,imp_data){
		if(err)
			console.log(err);
		else
			res.render("./employee/edit.ejs",{imp_id:req.params.id, imp_data:imp_data});	
		});
});
// Update Employee details
router.put("/:id",middleware.isLoggedIn,function(req,res){
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

// review done
router.post("/:id/reviewdone",middleware.isLoggedIn,function(req,res){
	User.findById(req.user._id).populate('notifications',null,{isRead: true}).exec();

	function findUpdateEmployee() {
		return new Promise(function(resolve, reject) {
			Employee.findByIdAndUpdate(req.params.id,{isreviewed:true},function(err,data){
				if(err)
					console.log(err);
				else
					resolve(data);
			});
		})
	}
	function createNotification() {
		return new Promise(function(resolve, reject) {
			var new_notif={    
				username   : req.user.username,
				employeeId : req.params.id,
				message    : "review complete",
				isRead     :false
			};
			Notification.create(new_notif,function(err,data){
				if(err)
				console.log(err);
				else
				resolve(data);
			});
		})
	}

	function findUserandUpdate(emp_data, notif_data) {
		return new Promise(function(resolve, reject) {
			
			User.findByIdAndUpdate(emp_data.author.id, {
				$push: {
					notifications: {
						$each: [notif_data],
						$position: 0
					}
				}
			}, {returnOriginal: false},function(err,data){
				if(err)
				console.log(err);
				else{
					console.log("findUserupdate---- \n"+data);
					resolve(data);
				}
			});
		});
	}
	async function updateReview() {
		var emp_data    = await findUpdateEmployee () ;
		console.log("find employee "+emp_data);
		var notif_data  = await createNotification (emp_data) ;
		console.log("created notification"+notif_data);
		var data        = await findUserandUpdate (emp_data, notif_data) ;
		console.log("done review and notif"+data);
		// var user_data    = await findUsers () ;
	}
	updateReview();
	res.redirect("/employee/"+req.params.id);
});


// DELETE employee details
router.get("/:id/delete",middleware.isLoggedIn,function(req,res){
	console.log("OWNERSHIP GOT");
	Employee.findByIdAndRemove(req.params.id,function(err){
		if(err)
			console.log(err);
		else
			res.redirect("/employee");
	});
});

module.exports=router;