var mongoose=require('mongoose');
var passportLocalMongoose=require('passport-local-mongoose');

var UserSchema= new mongoose.Schema({
	username:String,
	password:String,
	notifications:[
	{
		type: mongoose.Schema.Types.ObjectId,
		ref:  'Notification'
	}
],
	review:[
	{
		type: mongoose.Schema.Types.ObjectId,
		ref:  'Employee'
	}
]
});
//Gives default functionality required for auth
UserSchema.plugin(passportLocalMongoose);

var User=mongoose.model("User",UserSchema);
module.exports=User;