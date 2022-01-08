if(process.env.NODE_ENV !== 'production'){

    require('dotenv').config();
}
const express =require('express');
const bodyParser = require('body-parser');
const ejs=require('ejs');
const mongoose=require("mongoose");
const app=express();
const md5=require('md5');
const session=require('express-session');
const passport=require('passport');
const passsportLocalMongoose=require('passport-local-mongoose');
const bcrypt=require('bcrypt');
const userscs=[];
const flash=require('express-flash');
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

 app.use(passport.initialize());
app.use(passport.session());
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
    username:String,
    password:String
});
const usercSchema= new mongoose.Schema({
    username:String,
    password:String,
    name:String,

    address:String,
   phoneNumber:String


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
const userDetailSchema=new mongoose.Schema({
    userEmail:String,
    userName:String,
    userAddress:String,
    userPhonenumber:String,
    modelName:String,
    carNumber:String,
    status:String,
    accept:String,
    deny:String
});
const reviewSchema=new mongoose.Schema({
    username:String,
    content:String
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
const Review=mongoose.model("Review",reviewSchema);
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

app.get("/register",function(req,res){
    res.render("register");
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

   User.findOne({username:username},function(err,foundUser){
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
let defcontent="Select your car";
app.get("/customer",function(req,res){
    
    if(req.isAuthenticated())
    {
        
        currentUser=req.user.username;
        console.log(currentUser);
        AvailVehicle.find({},function(err,availVehicleList){
            if(availVehicleList.length>=0)
            {
                res.render("customer",{newListItems:availVehicleList,user:currentUser,content:defcontent});
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
    else{
        res.redirect("/loginc");
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

    const newUser=new User({
    email:req.body.email,
    password:md5(req.body.password),
   // name:req.body.cname,
   // address:req.body.caddress,
   // phonenumber:req.body.cpno
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
    res.redirect("/home");
  });

    
    app.post("/login",function(req,res){
        const username=req.body.email;
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
    let vehicleId=req.body.addTo;
    
    Vehicle.findById(vehicleId,function(err,avl){
        if(!err){
            AvailVehicle.exists({carNo:avl.carNo},function(err,doc){
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
const email=req.body.user;
let userdetail;

Userc.findOne({username:email},function(err,user){
    console.log(user);
    if(!err){
        userdetail=user.name;
    AvailVehicle.findById(vehicleId,function(err,book){
        if(!err){
        const bookvehicle=new BookedVehicle({
            modelName:book.modelName,
            carYear:book.carYear,
            carNo:book.carNo,
            carTrans:book.carTrans,
            carRate:book.carRate
    
        });
      //  defcontent="Hello"+userdetail.name+". Thank you for using VBC RENTALS, your booking details will be sent via mail"+"Selected car details"+ "\nmodel Name"+book.modelName+"\ncar Year"+book.carYear+"\ncarNo"+book.carNo+"\ncarTrans"+book.carTrans+"\ncarRate"+book.carRate;
        let newUser=new UserDetail({
            userEmail:user.username,
            userName:user.name,
            userAddress:user.address,
            userPhonenumber:user.phoneNumber,
            modelName:book.modelName,
            carNumber:book.carYear,
            status:"Pending",
            accept:"Accept",
            deny:"Deny"

        });
        bookvehicle.save();
        newUser.save();
    
        }
        else{
            console.log(err);
        }
    });
    AvailVehicle.findByIdAndRemove(vehicleId,function(err){
        if(!err){
            console.log("successfully deleted");
            res.redirect("/customer");
        }
        else{
            console.log(err);
        }
    })
}
});


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
    
  app.post("/loginc",function(req,res){

    const userc=new Userc({
        username:req.body.username,
        password:req.body.password
    });

    req.logIn(userc,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/customer");
                //return userc;
            })
        }
    })
});

app.get("/users",function(req,res){
    
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

});
app.post("/review",function(req,res){
    const newReview=new Review({
        username:req.body.review,
        content:req.body.reviewBody
    });
    newReview.save();
    res.redirect("/customer");
});
app.post("/statusAccept",function(req,res){
   const userId=req.body.accept;
   console.log(userId);
   const update={
       status:"Accepted",
       accept:"Accepted",
       deny:""
   };
    UserDetail.findOneAndUpdate({_id:userId},update,function(err,userInfo){
        if(!err){
        console.log(userInfo);     
        }
        else{
            console.log("err");
        }
    });
    res.redirect("/users");

});
app.post("/statusDeny",function(req,res){
    const userId=req.body.deny;
    console.log(userId);
    const update={
        status:"Denied",
        accept:"",
        deny:"Denied"
    };
     UserDetail.findOneAndUpdate({_id:userId},update,function(err,userInfo){
         if(!err){
         console.log(userInfo);     
         }
         else{
             console.log("err");
         }
     });
     res.redirect("/users");
 
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