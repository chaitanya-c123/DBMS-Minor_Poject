require('dotenv').config();

const express =require('express');
const bodyParser = require('body-parser');
const ejs=require('ejs');
const mongoose=require("mongoose");
const app=express();
const md5=require('md5');
const os=require('os');
var vehicles=[];
var workItems=[];
const session=require('express-session');
const exphdb=require('handlebars');
const passport=require('passport');
//const localStrateegy=require('passport-local').Strategy;
const passportLocalMongoose=require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//const bcrypt=require('bcrypt');
//const userscs=[];
//const flash=require('express-flash');
//const usermodel=require("./models/user");
//const findOrCreate = require('mongoose-findorcreate');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
//app.use(flash())
app.use(session({
    secret:"our secret",
    resave:false,
    saveUninitialized:false

}));

 app.use(passport.initialize());
 app.use(passport.session());
//  app.use((req,res,next)=>{
//      //console.log(req.session);
//      console.log(req.user);
//  })
console.log(process.env.API_KEY);
mongoose.connect("mongodb://localhost:27017/rentalDB",{useNewUrlParser:true});


// const isAuth=(req,res,next)=>{
//     if(req.session.isAuth){
//         next()
//     }else{
//         res.redirect("/loginc");
//     }
// }
// const isAutha=(req,res,next)=>{
//     if(req.session.isAuth){
//         next()
//     }else{
//         res.redirect("/login");
//     }
// }

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
const usercSchema= new mongoose.Schema({
    email:String,
    password:String,
    //address:String,
   // phonenumber:String

});
usercSchema.plugin(passportLocalMongoose);
//userSchema.plugin(passportLocalMongoose);
//usercSchema.plugin(findOrCreate);
//usercSchema.plugin(passsportLocalMongoose);

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


passport.use(Userc.createStrategy());
passport.serializeUser(Userc.serializeUser());
passport.deserializeUser(Userc.deserializeUser());

// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   Userc.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log(profile);

//     Userc.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));


app.get("/",function(req,res){
    res.render("homepage");
});

app.get("/loginhome",function(req,res){
    res.render("loginhome");
});


// app.get("/auth/google",
//   passport.authenticate('google', { scope: ["profile"] })
// );

// app.get("/auth/google/secrets",
//   passport.authenticate('google', { failureRedirect: "/login" }),
//   function(req, res) {
//     // Successful authentication, redirect to secrets.
//     res.redirect("/secrets");
//   });

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

// const newUser=new User({
//     email:"vasbhach@gmail.com",
//     password:md5("303560")
// });
// newUser.save(function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log('Success');
//     }
// });
// app.post("/login",function(req,res){
//     const username=req.body.username;
//     const password=md5(req.body.password);

//    User.findOne({email:username},function(err,foundUser){
//        if(err){
//            console.log(err);
//        }else{
//            if(foundUser){
//                if(foundUser.password===password){
//                    res.redirect("/home");
//                }
//            }
//        }
//    })

// });
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
    res.redirect("/customer");
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
app.get("/customer",function(req,res){
    var idArray=[];
    if(req.isAuthenticated())
   
    {
        console.log(req.user);
        const currentUser=req.user.email;
        idArray.push(currentUser);
        AvailVehicle.find({},function(err,availVehicleList){
            if(availVehicleList.length>=0)
            {
                res.render("customer",{newListItems:availVehicleList,user:currentUser});
            }
            if(err)
            {
                console.log(err);
            }
            else{
                console.log("Successfully customer list shown");
                const userInfo=os.userInfo();
                const uid=userInfo.name;
                console.log(uid);
            }
        });
   
    }else {
        res.redirect("/loginc");
    }
       

});
app.get("/booked",function(req,res){
  let bookedVehicleList = BookedVehicle.find({});
  //let user = Userc.findById(req.userc.id);
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
// app.post("/register",function(req,res){

//     User.register({username:req.body.email},req.body.password,function(err,user){
//         if(err){
//             console.log(err);
//             res.redirect("/register");
//         }else {
//             passport.authenticate("local")(req,res,function(){
//                 res.redirect("/booked");
//             });
//         }
//     });
    
//     });
//     app.post("/login",function(req,res){
    
//         const user=new User({
//             username:req.body.email,
//             password:req.body.password
//         });
    
//         req.logIn(user,function(err){
//             if(err){
//                 console.log(err);
//             }else{
//                 passport.authenticate("local")(req,res,function(){
//                     res.redirect("/booked");
//                    // return userc;
//                 })
//             }
//         })
//     });
// app.post("/delete",function(req,res){
//     const vehicleId=req.body.deleted;
//     Vehicle.findByIdAndRemove(vehicleId,function(err){
//         if(!err){
//             console.log("successfully deleted");
//             res.redirect("/home");
//         }
//         else{
//             console.log(err);
//         }
//     })
// });
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
//oldpassport*****************************************************
app.post("/registerc",function(req,res){

Userc.register({username:req.body.username},req.body.password,function(err,user){
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
                return userc;
            })
        }
    })
});
app.get("/logout",function(req,res){
    console.log(req.user.email);
    req.logout();
    
    res.redirect("/loginc");
})
//old passport****************************************************
// app.post("/registerc", function(req, res){

//     Userc.register({username: req.body.username}, req.body.password, function(err, user){
//       if (err) {
//         console.log(err);
//         res.redirect("/registerc");
//       } else {
//         passport.authenticate("local")(req, res, function(){
//           res.redirect("/customer");
//         });
//       }
//     });
  
//   });

// app.post("/loginc", function(req, res){

//   const user = new Userc({
//     username: req.body.username,
//     password: req.body.password
//   });

//   req.login(user, function(err){
//     if (err) {
//       console.log(err);
//     } else {
//       passport.authenticate("local")(req, res, function(){
//         res.redirect("/customer");
//       });
//     }
//   });

// });


// app.post("/registerc",function(req,res){

//     const newUser=new Userc({
//     email:req.body.cemail,
//     password:md5(req.body.cpassword),
//     name:req.body.name,
    
//     });
//     newUser.save();
    
//     res.redirect("/loginc");
//   });

//   app.post("/loginc",function(req,res){
//     const username=req.body.cemail;
//     const password=md5(req.body.cpassword);

//     Userc.findOne({email:username},function(err,foundUser){
//         if(err){
//             console.log(err);
//         }
//           else{if(foundUser){
//               if(foundUser.password===password){
//                 req.session.isAuth=true;
//                 res.redirect("/customer");
//                 console.log(foundUser.name);
//               }
//           }

//         }



//     });
// });
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
app.post("/logout",(req,res) =>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect("/loginc");
    })
})
app.post("/logouta",(req,res) =>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect("/login");
    })
})
app.listen(3000,function(){
    console.log("Server started on posrt 3000");
});

