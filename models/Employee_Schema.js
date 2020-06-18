//EMPLOYEE SCHEMA
var mongoose=require('mongoose');
var EmployeeSchema= new mongoose.Schema({
	name        : String,
	image       : String,
	age         : String,
	post        : String,
	isreviewed  : {type: Boolean, default:false},
	location    : {type:String,default:"No location provided"},
	description : {type:String,default:"No description provided"},
	salary		: String,
	author :
	{
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : "User"
		   },
		 username:String
	},
});
var EmployeeSchema=mongoose.model("Employee",EmployeeSchema);
module.exports=EmployeeSchema;