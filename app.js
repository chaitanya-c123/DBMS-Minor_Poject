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
});

const usercSchema= new mongoose.Schema({
    email:String,
    password:String,
    name:String,
    address:String,
    phonenumber:String

});

const vehicleSchema={
    modelName:String,
    carYear:String,
    carNo:String,
    carTrans:String,
    carRate:Number
};
const availVehicleSchema={
    modelName:String,
    carYear:String,
    carNo:String,
    carTrans:String,
    carRate:Number
};
let vehicleList=[];
let availVehicleList=[];
let bookedVehicleList=[];
const User=new mongoose.model("User",userSchema);
const Userc=new mongoose.model("Userc",usercSchema);
const Vehicle=mongoose.model("Vehicle",vehicleSchema);
const AvailVehicle=mongoose.model("AvailVehicle",vehicleSchema);
const BookedVehicle=mongoose.model("BookedVehicle",vehicleSchema);



// const defVehicle=new Vehicle({
//     modelName:"Swift",
//     carYear:"2019",
//     carNo:"KA-21-2345",
//     carTrans:"Petrol",
//     carRate:"17"
// });
// defVehicle.save();

app.get("/",function(req,res){
    res.render("homepage");
});

app.get("/loginhome",function(req,res){
    res.render("loginhome");
});

app.get("/homec",function(req,res){

    res.render("homec");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/registerc",function(req,res){
    res.render("registerc");
});

app.get("/loginc",function(req,res){

    res.render("loginc");
    
    });

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
app.get("/customer",function(req,res){
    AvailVehicle.find({},function(err,availVehicleList){
        if(availVehicleList.length>0)
        {
            res.render("customer",{newListItems:availVehicleList});
        }
        if(err)
        {
            console.log(err);
        }
        else{
            console.log("Successfully customer list shown");
        }
    });

});
app.get("/booked",function(req,res){
  BookedVehicle.find({},function(err,bookedVehicleList){
      if(bookedVehicleList.length>0)
      {
          res.render("booked",{newListItems:bookedVehicleList});
      }
      if(err)
      {
          console.log(err);
      }
      else{
          console.log("booked");
      }

  })

});

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
app.post("/addTo",function(req,res){
    const vehicleId=req.body.addTo;
    Vehicle.findById(vehicleId,function(err,avl){
        if(!err){
        const availvehicle=new AvailVehicle({
            modelName:avl.modelName,
            carYear:avl.carYear,
            carNo:avl.carNo,
            carTrans:avl.carTrans,
            carRate:avl.carRate
        });
        availvehicle.save();
    }
    else{
        console.log(err);
    }

    })
    res.redirect("/home");
});
app.post("/click",function(req,res){
const vehicleId=req.body.click;
AvailVehicle.findById(vehicleId,function(err,book){
    if(!err){
    const bookvehicle=new BookedVehicle({
        modelName:book.modelName,
        carYear:book.carYear,
        carNo:book.carNo,
        carTrans:book.carTrans,
        carRate:book.carRate

    });
    bookvehicle.save();

    }
    else{
        console.log(err);
    }
});
 
res.redirect("/customer");


})

app.post("/registerc",function(req,res){

    const newUser=new Userc({
    email:req.body.cusername,
    password:md5(req.body.cpassword),
    name:req.body.cname,
    address:req.body.caddress,
    phonenumber:req.body.cpno
    });
    newUser.save();
    // newUser.save(function(err){
    //   if(err){
    //     console.log(err);
    //   }/*else{
    //     res.redirect("/home");
    //   }*/
    // });
    // res.redirect("/home");
    res.redirect("/customer");
  });

  app.post("/loginc",function(req,res){
    const username=req.body.username;
    const password=md5(req.body.password);

    Userc.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        }
          else{if(foundUser){
              if(foundUser.password===password){
                res.redirect("/customer");
              }
          }

        }



    });
});


app.listen(3000,function(){
    console.log("Server started on posrt 3000");
});