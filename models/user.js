const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const usercSchema= new mongoose.Schema({
    email:String,
    password:String,
    name:String,
    //address:String,
   // phonenumber:String

});
module.exports=mongoose.model('user',usercSchema);