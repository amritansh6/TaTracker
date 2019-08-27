var express=require('express');
var app=express();
// used for req.body 
var bodyParser=require('body-parser');
var mongoose=require('mongoose');

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
app.use(bodyParser.urlencoded({extended: true})); 

// //Require Employee Schema
var Employee=require("./models/Employee_Schema.js");

// // Shortened Routes codes Required
var  EmployeeRoutes=require('./routes/employee.js');

//==========================================

//__dirname is whole directory name  
app.use(express.static(__dirname + "/public"));

//================================================
app.get("/",function(req,res){
	console.log("ROOT REACHED!");
	res.render("cover.ejs");
});

//Refactored routes use

app.use("/employee",EmployeeRoutes);


// Server Listing IP and Port
app.listen(3000,'127.0.0.1',function(){
	console.log("Server On !!");
});
