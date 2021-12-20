require('dotenv').config();
const express =require('express');
const bodyParser = require('body-parser');
const ejs=require('ejs');
const mongoose=require("mongoose");
const app=express();
const md5=require('md5');
var items=["Buy food","Cook food","Eat food"];
var vehicles=[];
var workItems=[];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
console.log(process.env.API_KEY);
mongoose.connect("mongodb://localhost:27017/rentalDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

const vehicleSchema={
    modelName:String,
    carYear:String,
    carNo:String,
    carTrans:String,
    carRate:Number
};
let vehicleList=[];
const User=new mongoose.model("User",userSchema);
const Vehicle=mongoose.model("Vehicle",vehicleSchema);
app.get("/",function(req,res){
    /* Vehicle.find({},function(err,vehicleList){
        if(vehicleList.length>0)
        {
            res.render("home",{newListItems:vehicleList});
         }
         if(err)
         {
             console.log(err);
        }
        else{
            console.log("Successfully shown");
        }
    });*/
    res.render("loginhome");
    
});
app.get("/login",function(req,res){

res.render("login");

})


const newUser=new User({
    email:"defg",
    password:md5("defg")
});
newUser.save(function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log('Success');
    }
});
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=md5(req.body.password);

   User.findOne({email:username},function(err,foundUser){
       if(err){
           console.log(err);
       }else{
           if(foundUser){
               if(foundUser.password===password){
                   res.redirect("/home");
               }
           }
       }
   })

});
app.get("/home",function(req,res){

 Vehicle.find({},function(err,vehicleList){
        if(vehicleList.length>0)
        {
            res.render("home",{newListItems:vehicleList});
        }
        if(err)
        {
            console.log(err);
        }
        else{
            console.log("Successfully shown");
        }
    });

})
app.get("/add",function(req,res){
    res.render("add");
});
app.post("/add",function(req,res){
    const vehDetails={
        modelName:req.body.modelName,
        carYear:req.body.carYear,
        carNo:req.body.carNo,
        carTrans:req.body.carTrans,
        carRate:req.body.carRate

    };
    const vehicle=new Vehicle({
        modelName:vehDetails.modelName,
        carYear:vehDetails.carYear,
        carNo:vehDetails.carNo,
        carTrans:vehDetails.carTrans,
        carRate:vehDetails.carRate
    });
    vehicle.save();
    res.redirect("/home");
});
app.post("/delete",function(req,res){
    const vehicleId=req.body.deleted;
    Vehicle.findByIdAndRemove(vehicleId,function(err){
        if(!err){
            console.log("successfully deleted");
            res.redirect("/home");
        }
        else{
            console.log(err);
        }
    })
});
app.listen(3000,function(){
    console.log("Server started on posrt 3000");
});