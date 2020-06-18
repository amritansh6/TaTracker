//NOTIFICATION SCHEMA
var mongoose=require('mongoose');
var NotificationSchema= new mongoose.Schema({
	username : String,
	employeeId: String,
	message: String,
	isRead:{type:Boolean, default:false },
});
var NotificationSchema=mongoose.model("Notification",NotificationSchema);
module.exports=NotificationSchema;