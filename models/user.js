var mongoose=require('mongoose');
var passportLocalMongoose=require('passport-local-mongoose');

var UserSchema= new mongoose.Schema({
	username:String,
	password:String
});
//Gives default functionality required for auth
UserSchema.plugin(passportLocalMongoose);

var User=mongoose.model("User",UserSchema);
module.exports=User;