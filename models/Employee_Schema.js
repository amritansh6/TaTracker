//EMPLOYEE SCHEMA
var mongoose=require('mongoose');
var EmployeeSchema= new mongoose.Schema({
	name        : String,
	image       : String,
	age         : String,
	post        : String,
	location    : {type:String,default:"No location provided"},
	description : {type:String,default:"No description provided"},
	salary		: String,
	admin:
	{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		   },
		 username:String
	}
});
var EmployeeSchema=mongoose.model("Employee",EmployeeSchema);
module.exports=EmployeeSchema;