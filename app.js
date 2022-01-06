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
//const passport=require('passport');
//const passsportLocalMongoose=require('passport-local-mongoose');
//const bcrypt=require('bcrypt');
//const userscs=[];
//const flash=require('express-flash');
//const usermodel=require("./models/user");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
//app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false

}));

 //app.use(passport.initialize());
// app.use(passport.session());
console.log(process.env.API_KEY);
mongoose.connect("mongodb://localhost:27017/rentalDB",{useNewUrlParser:true});

const isAuth=(req,res,next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect("/loginc");
    }
}

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
const usercSchema= new mongoose.Schema({
    username:String,
    password:String,
    name:String,

    address:String,
   phoneNumber:String


});

//usercSchema.plugin(passsportLocalMongoose);

const vehicleSchema={
    modelName:String,
    carYear:String,
    carNo:String,
    carTrans:String,
    carRate:Number
};

const userDetailSchema={
    userEmail:String,
    userName:String,
    userAddress:String,
    userPhonenumber:String,
    modelName:String,
    carNumber:String

};
const availVehicleSchema={
    modelName:String,
    carYear:String,
    carNo:String,
    carTrans:String,
    carRate:Number
};
const userDetailSchema=new mongoose.Schema({
    userEmail:String,
    userName:String,
    userAdress:String,
    userPhonenumber:String,
    modelName:String,
    carNumber:String
});
let vehicleList=[];
let availVehicleList=[];
let bookedVehicleList=[];
const User=new mongoose.model("User",userSchema);
const Userc=new mongoose.model("Userc",usercSchema);



const Vehicle=mongoose.model("Vehicle",vehicleSchema);
const AvailVehicle=mongoose.model("AvailVehicle",vehicleSchema);
const BookedVehicle=mongoose.model("BookedVehicle",vehicleSchema);
const UserDetail=mongoose.model("UserDetail",userDetailSchema);

passport.use(Userc.createStrategy());
passport.serializeUser(Userc.serializeUser());
passport.deserializeUser(Userc.deserializeUser());


app.get("/",function(req,res){
    res.render("homepage");
});

//const Usercu = require('./models/user');
// passport.use(Userc.createStrategy());
// passport.serializeUser(Userc.serializeUser());
// passport.deserializeUser(Userc.deserializeUser());

 

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
app.get("/root",function(req,res){
    res.render("root");
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
var currentUser;
app.get("/customer",function(req,res){
    
    if(req.isAuthenticated())
    {
        
        currentUser=req.user.username;
        console.log(currentUser);
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
    }
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

app.post("/register",function(req,res){

    User.register({username:req.body.email},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else {
            passport.authenticate("local")(req,res,function(){
                res.redirect("/booked");
            });
        }
    });
    
    });
    app.post("/login",function(req,res){
    
        const user=new User({
            username:req.body.email,
            password:req.body.password
        });
    
        req.logIn(user,function(err){
            if(err){
                console.log(err);
            }else{
                passport.authenticate("local")(req,res,function(){
                    res.redirect("/booked");
                   // return userc;
                })
            }
        })
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
            AvailVehicle.exists({name:avl.modelName},function(err,doc){
             if(!err){
                if(!doc)
                {
                    const availvehicle=new AvailVehicle({
                        modelName:avl.modelName,
                        carYear:avl.carYear,
                        carNo:avl.carNo,
                        carTrans:avl.carTrans,
                        carRate:avl.carRate 
                    });
                availvehicle.save();
                }
            }
            });
        }
      });
    res.redirect("/home");
});

app.post("/click",function(req,res){
    console.log("click");
const vehicleId=req.body.click;
const username=currentUser;
Userc.findOne({email:username},function(err,user){
    console.log(user);
    if(!err){
    AvailVehicle.findById(vehicleId,function(err,book){
        if(!err){
        const bookvehicle=new BookedVehicle({
            modelName:book.modelName,
            carYear:book.carYear,
            carNo:book.carNo,
            carTrans:book.carTrans,
            carRate:book.carRate
    
        });
        const newUser=new UserDetail({
            userEmail:user.username,
            userName:user.name,
            userAddress:user.address,
            userPhonenumber:user.phoneNumber,
            modelName:book.modelName,
            carNumber:book.carYear

        });
        bookvehicle.save();
        newUser.save();
    
        }
        else{
            console.log(err);
        }
    });
}
});
res.redirect("/customer");

});
app.post("/registerc",function(req,res){

Userc.register({username:req.body.username,name:req.body.name,address:req.body.address,phoneNumber:req.body.pno},req.body.password,function(err,user){
    if(err){
        console.log(err);
        res.redirect("/registerc");
    }else {
        passport.authenticate("local")(req,res,function(){
            res.redirect("/customer");
        });
    }

});

});




app.post("/registerc",function(req,res){

    const newUser=new Userc({
    email:req.body.email,
    password:md5(req.body.password),
    name:req.body.name,
    
    });
    newUser.save();
    
    res.redirect("/loginc");
  });

  app.post("/loginc",function(req,res){
    const username=req.body.cemail;
    const password=md5(req.body.cpassword);

    Userc.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        }
          else{if(foundUser){
              if(foundUser.password===password){

                req.session.isAuth=true;
                res.redirect("/customer");
              }
          }

        }



    });
});

app.get("/users",function(req,res){
    
    if(req.isAuthenticated())
   
    {
        UserDetail.find({},function(err,bookedDetails){
            if(availVehicleList.length>=0)
            {
                res.render("users",{newListItems:bookedDetails});
            }
            if(err)
            {
                console.log(err);
            }
            else{
                console.log("Successfully customer list shown");
                // const userInfo=os.userInfo();
                // const uid=userInfo.name;
                // console.log(uid);
            }
        });
   
    }else {
        res.redirect("/loginc");
    }
       

});
app.get("/logout",function(req,res){
    console.log(req.user.email);
    req.logout();
    
    res.redirect("/loginc");
});


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
});

app.listen(3000,function(){
    console.log("Server started on posrt 3000");
})
