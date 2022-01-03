if(process.env.NODE_ENV !== 'production'){

    require('dotenv').config();
}
const express =require('express');
const bodyParser = require('body-parser');
const ejs=require('ejs');
const mongoose=require("mongoose");
const app=express();
const md5=require('md5');
var items=["Buy food","Cook food","Eat food"];
var vehicles=[];
var workItems=[];
const session=require('express-session');
const passport=require('passport');
const passsportLocalMongoose=require('passport-local-mongoose');
const bcrypt=require('bcrypt');
const userscs=[];
const flash=require('express-flash')

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("public"));
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false

}));

 app.use(passport.initialize());
 app.use(passport.session());
console.log(process.env.API_KEY);
mongoose.connect("mongodb://localhost:27017/rentalDB",{useNewUrlParser:true});



const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

const usercSchema= new mongoose.Schema({
    username:String,
    password:String,
    name:String,
    //address:String,
   // phonenumber:String

});
usercSchema.plugin(passsportLocalMongoose);

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
//const Usercu = require('./models/user');
// passport.use(Userc.createStrategy());
// passport.serializeUser(Userc.serializeUser());
// passport.deserializeUser(Userc.deserializeUser());
const initializePassport=require('./passport-config');
initializePassport(passport,
    email=>userscs.find(user=>user.email === email),
    id=>userscs.find(user=>user.id === id)
)

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

app.get("/registerc",checkNotAuthenticated,function(req,res){
    res.render("registerc");
});

app.get("/loginc",checkNotAuthenticated,function(req,res){

    res.render("loginc");
    
    });

const newUser=new User({
    email:"vasbhach@gmail.com",
    password:md5("303560")
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
        if(vehicleList.length>=0)
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
app.get("/customer",checkAuthenticated,function(req,res){

        AvailVehicle.find({},function(err,availVehicleList){
            if(availVehicleList.length>=0)
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
    // const available=new AvailVehicle({
    //     modelName:vehDetails.modelName,
    //     carYear:vehDetails.carYear,
    //     carNo:vehDetails.carNo,
    //     carTrans:vehDetails.carTrans,
    //     carRate:vehDetails.carRate

    // });
    vehicle.save();
   // available.save();
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

// app.post("/registerc",function(req,res){

//     const newUser=new Userc({
//     email:req.body.cusername,
//     password:md5(req.body.cpassword),
//     name:req.body.cname,
//     address:req.body.caddress,
//     phonenumber:req.body.cpno
//     });
//     newUser.save();
//     // newUser.save(function(err){
//     //   if(err){
//     //     console.log(err);
//     //   }/*else{
//     //     res.redirect("/home");
//     //   }*/
//     // });
//     // res.redirect("/home");
//     res.redirect("/customer");
//   });

//   app.post("/loginc",function(req,res){
//     const username=req.body.username;
//     const password=md5(req.body.password);

//     Userc.findOne({email:username},function(err,foundUser){
//         if(err){
//             console.log(err);
//         }
//           else{if(foundUser){
//               if(foundUser.password===password){
//                 res.redirect("/customer");
//               }
//           }

//         }



//     });
// });
app.post("/registerc",checkNotAuthenticated,async(req,res)=>{
    try{
      const hashedPassword=await bcrypt.hash(req.body.password, 10)
      userscs.push({
           id:Date.now().toString(),
           name:req.body.name,
           email:req.body.email,
           password:hashedPassword

      })
      res.redirect('/loginc');
    }catch{
      res.redirect('/registerc');

    }

console.log(userscs);

});
app.post('/loginc',checkNotAuthenticated,passport.authenticate('local',{
successRedirect: '/customer',
failureRedirect: '/loginc',
failureFlash:true

}));
var nodemailer=require('nodemailer');
var transport=nodemailer.createTransport(
    {
        service:'gmail',
        auth:{
            user:'vasbhach@gmail.com',
            pass:'303560db'


        }
    }
)

var mailOptions={
    from:'vasbhach@gmail.com',
    to:'vasukisravanth26@gmail.com',
    subject:'VBC RENTALS',
    text:'Thank you for using VBC rentals. You booked a vehicle .'
}
transport.sendMail(mailOptions,function(err,info){
    if(err){
        console.log(err);
    }
    else{
        console.log("Email sent"+info.response);
    }
})

function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
      return next()
  }
res.redirect('/loginc')
}
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
      return  res.redirect('/customer')
    }
    next();
}
app.listen(3000,function(){
    console.log("Server started on posrt 3000");
});

