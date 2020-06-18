var express=require('express');
var app=express();
// used for req.body 
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var flash=require('connect-flash');

//mongoose.connect("mongodb+srv://Hsuya1100:itseasy@cluster0-aho80.mongodb.net/test?retryWrites=true", { useNewUrlParser: true },function(err,db){
//	if(err)
//		console.log(err);
//	else
//		console.log("Connected to DB");
//});
mongoose.connect("mongodb://localhost/employee_mgmnt", { useNewUrlParser: true },function(err,db){
	if(err)
		console.log(err);
	else
		console.log("Connected to MongoDB ! ");
});

var request=require('request');
app.use(flash());
app.use(bodyParser.urlencoded({extended: true})); 

// //Require  Schema
var Employee=require("./models/Employee_Schema.js");
var User=require('./models/user.js'); 

// // Shortened Routes codes Required
var  EmployeeRoutes=require('./routes/employee.js');
var  indexRoutes   =require('./routes/index.js');
//==========================================

//__dirname is whole directory name  
app.use(express.static(__dirname + "/public"));

// passport config
app.use(require("express-session")({
	secret:"as2312d7as87wq2bje",
	resave:false,
	saveUninitialized:false
}))	;
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async function(req,res,next){
	res.locals.userDetails=req.user;
	if(req.user){
		try{
			let user =await User.findById(req.user._id).populate('notifications',null,{isRead: false}).exec();
			res.locals.notifications = user.notifications;
		}catch(err) {
			console.log(err.message);
		}
	}
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

//================================================
app.get("/",function(req,res){
	console.log("ROOT REACHED!");
	res.render("cover.ejs");
});


//Refactored routes use

app.use(indexRoutes);
app.use("/employee",EmployeeRoutes);


// Server Listing IP and Port
app.listen(3000,'127.0.0.1',function(){
	console.log("Server On !!");
});
