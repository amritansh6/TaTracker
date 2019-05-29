//CAMPGROUND SCHEMA
var mongoose=require('mongoose');
var CampgroundSchema= new mongoose.Schema({
	name:String,
	image:String,
	description:{type:String,default:"No description provided"},
	author:
	{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		   },
		 username:String
	},
	comments: 
	[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"	
		}
	]
});
var Campgrounds=mongoose.model("Campgrounds",CampgroundSchema);
module.exports=Campgrounds;