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
const flash=require('connect-flash');
var nodemailer=require('nodemailer');
const  multer =require('multer');
var path=require('path');
const delay = require('delay');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false

}));
app.use(flash());

 app.use(passport.initialize());
app.use(passport.session());
console.log(process.env.API_KEY);
mongoose.connect("mongodb://localhost:27017/rentalDB",{useNewUrlParser:true});


   

const userSchema=new mongoose.Schema({
    username:String,
    password:String
});
const usercSchema= new mongoose.Schema({
    username:String,
    password:String,
    name:String,
    address:String,
    phoneNumber:String,
    image:String,
    imagei:String

});

//usercSchema.plugin(passsportLocalMongoose);


const vehicleSchema={
    modelName:String,
    carYear:String,
    carNo:String,
    carTrans:String,
    carRate:Number,
    image:String

};
const userDetailSchema=new mongoose.Schema({
    bookingNumber:String,
    userEmail:String,
    userName:String,
    userAddress:String,
    userPhonenumber:String,
    modelName:String,
    carNumber:String,
    image:String,
    arrivalDate:String,
    returnDate:String,
    status:String,
    totPrice:Number,
    Profileimage:String
});
const reviewSchema=new mongoose.Schema({
    username:String,
    content:String
});
const querySchema=new mongoose.Schema({
    username:String,
    queryContent:String,
    reply:String
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
const Query=mongoose.model("Query",querySchema);




const isAuth=(req,res,next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect("/login");
    }
}
const isAuthc=(req,res,next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect("/loginc");
    }
}
app.get("/loginhome",function(req,res){
    res.render("loginhome");
});

app.get("/homec",function(req,res){

    res.render("homec");
});
// app.get("/register",function(req,res){
//     res.render("register");
//   });
app.get("/login",function(req,res){
  res.render("login");
});
var Storage= multer.diskStorage({
  destination:"./public/upload/",
  filename:(req,file,cb)=>{
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});
var profileStorage=multer.diskStorage({
    destination:"./public/profileUpload/",
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
});
var profileUpload=multer({
    storage:profileStorage
}).single('file');
var Storagei= multer.diskStorage({
    destination:"./public/uploadi/",
    filename:(req,file1,cb)=>{
        cb(null,file1.fieldname+"_"+Date.now()+path.extname(file1.originalname));
    }
  });
var uploadi=multer({
    storage:Storagei
}).single('filei');

var upload=multer({
    storage:Storage
}).single('file');
app.post('/upload',profileUpload,function(req,res,next){
    var imageFile=req.file.filename;
    const update={
        image:imageFile
    };
    var user=req.body.id;
     Userc.findOneAndUpdate({username:user},update,function(err,userInfo){
         if(!err){
         console.log(userInfo);   
         }
         else{
             console.log("err");
         }
     });
     function myfun(){
     Userc.findOne({username:user},function(err,userInfo){
        UserDetail.find({userEmail:user},function(err,bookingInfo){
          Review.find({username:user},function(err,reviewInfo){
            Query.find({username:user},function(err,queryInfo){
             res.render("profile",{userdetail:userInfo,reviews:reviewInfo,queries:queryInfo,previousBookings:bookingInfo});
        });
       });
     });
    });
}
setTimeout(myfun,2000);
});

app.post("/add",upload,function(req,res){
    const vehicle=new Vehicle({
        modelName:req.body.modelName,
        carYear:req.body.carYear,
        carNo:req.body.carNo,
        carTrans:req.body.carTrans,
        carRate:req.body.carRate,
        image:req.file.filename

    });
    const availvehicle=new AvailVehicle({
        modelName:req.body.modelName,
        carYear:req.body.carYear,
        carNo:req.body.carNo,
        carTrans:req.body.carTrans,
        carRate:req.body.carRate,
        image:req.file.filename
    });
    availvehicle.save();
   
    vehicle.save();
   // available.save();
    res.redirect("/home");
});
app.get("/registerc",function(req,res){
    res.render("registerc");
});


app.get("/loginc",function(req,res){


    res.render("loginc");
  });


const newUser=new User({
    username:"vasbhach@gmail.com",
    password:md5("303560")
});
User.exists({username:"vasbhach@gmail.com"},function(err,doc){
if(!err)
{
    if(!doc)
    {
        newUser.save(function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log('Success');
            }
        });
    }
}
});
var error=0;
app.post("/login",function(req,res){
    const username=req.body.username;
    const password=md5(req.body.password);
  console.log('hello');
   User.findOne({username:username},function(err,foundUser){
       if(err){
           console.log(err);
       }else{
           if(foundUser){
               if(foundUser.password===password){
                   req.session.isAuth=true;
                   res.redirect("/home");
               }else{
                   res.render("login",{error:"Incorrect password"});
               }
               
           }else{
               res.render("login",{error:"Incorrect username"});
           }
       }
   })

});
app.post("/loginc",function(req,res){
    const username=req.body.username;
    const password=md5(req.body.password);
  console.log('hello');
   Userc.findOne({username:username},function(err,foundUser){6
       if(err){
           console.log(err);
       }else{
           if(foundUser){
               if(foundUser.password===password){
                   req.session.isAuth=true;
                   var link=`/customer/${username}`;
                   res.redirect(link);
               }else{
                  res.render("loginc",{error:"Incorrect password"});
               }
               
           }else{
               res.render("loginc",{error:"Incorrect username"});
           }
           
       }
   })

});

app.get("/image/:imageDetail",function(req,res){
    res.render("image",{image:req.params.imageDetail});
});
app.get("/map",function(req,res){
    res.render("map");
})
app.get("/",function(req,res){
   
 Review.find({},function(err,reviewList){
    if(reviewList.length>=0)
    {
        Query.find({},function(err,queryList){
            if(queryList.length>=0)
            {
                res.render("root",{reviews:reviewList,queries:queryList});
            }
            if(err)
            {
                console.log(err);
            }
            else{
                console.log("Query shown");
            }
        });
    }
    if(err)
    {
        console.log(err);
    }
});

});
app.get("/home",isAuth,function(req,res){

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
});



let defcontent="Select your car";
app.get("/customer/:username",isAuthc,function(req,res){
   
    if(req.isAuthenticated)
    {
        currentUser=req.params.username;
        console.log(currentUser);
        AvailVehicle.find({},function(err,availVehicleList){
            UserDetail.find({userEmail:currentUser},function(err,previousBook){
                Userc.findOne({username:currentUser},function(err,userprofile){
                   
            if(availVehicleList.length>=0)
            {
                res.render("customer",{newListItems:availVehicleList,userdetail:userprofile,user:currentUser,previousBookings:previousBook});


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
    });
    }
     
      


    
    else{
        res.redirect("/loginc");
    }

    });



  

    app.get("/booked",isAuth,function(req,res){
        if(req.isAuthenticated)
        {
    
            BookedVehicle.find({},function(err,bookedVehicleList){
                if(bookedVehicleList.length>=0)
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
    
    
        }
      
    
    });
app.post("/book",function(req,res){
    res.redirect("/booked");
});

app.get("/add",isAuth,function(req,res){
    if(req.isAuthenticated){
    res.render("add");
    }
});

app.post("/addPage",function(req,res){
    res.redirect("/add");
});
app.get("/contact",function(req,res){
    res.render("contact");
})
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


app.post("/click/:user",function(req,res){

    console.log("click");
    const vehicleId=req.body.click;
        var arrDate=req.body.arrdate;
        var retDate=req.body.retdate;
        const cur=req.params.user;

        Userc.findOne({username:cur},function(err,user){
           // console.log(user);
            if(!err){

              var  userdetail=user.name;

            AvailVehicle.findById(vehicleId,function(err,book){
                if(!err){
                    var ve=book.modelName;
                    var cn0=book.carNo;
            let bookvehicle=new BookedVehicle({
                modelName:book.modelName,
                carYear:book.carYear,
                carNo:book.carNo,
                carTrans:book.carTrans,
                carRate:book.carRate,
                avail:retDate
        
            });
        var price;
        var no_of_days;
        var aryear=Number(arrDate.substring(6,10));
        var retyear=Number(retDate.substring(6,10));
        var retmon=Number(retDate.substring(3,5));
        var arrmon=Number(arrDate.substring(3,5));
        var arrdat=Number(arrDate.substring(0,2));
        var retdat=Number(retDate.substring(0,2));
        if((retyear-aryear)>0){
            retmon+=(retyear-aryear)*12;
            }
            if((retmon-arrmon)>0){
                retdat+=(retmon-arrmon)*30;
            }
            no_of_days=retdat-arrdat;
            console.log(no_of_days);
            price=book.carRate*no_of_days;

            let newUser=new UserDetail({
                bookingNumber:Date.now(),
                userEmail:user.username,
                userName:user.name,
                userAddress:user.address,
                userPhonenumber:user.phoneNumber,
                modelName:book.modelName,
                carNumber:book.carNo,
                image:user.imagei,
                status:"Pending",
                arrivalDate:arrDate,
                returnDate:retDate,
                totPrice:price,
                Profileimage:user.image
            });
            
            bookvehicle.save();
            newUser.save();
                console.log(ve);


                var transport=nodemailer.createTransport(
                    {
                        service: 'gmail',
                           auth: {
                            user: 'vasbhach@gmail.com',
                             pass: '303560db'
                           }
                    }
                )
                
                var mailOptions={
                    from:'vasbhach@gmail.com@gmail.com',
                    to:cur,
                    subject:'VBC RENTALS',
                    text:`Hi ${user.name}, Thank you for choosing VBC rentals. Booking Number : ${newUser.bookingNumber}. You have selected ${ve},Vehicle number is ${cn0}. Estimated Price : ${newUser.totPrice} `
                    
                }
                transport.sendMail(mailOptions,function(error,info){
                    if(error){
                        console.log(error)
                    } else{
                        console.log('email sent'+info.response);
                    }
                });


                }
                else{
                    console.log(err);
                }
            });
                      AvailVehicle.findByIdAndRemove(vehicleId,function(err){
                if(!err){
                   // console.log(veh.avail);
                    console.log("successfully deleted");
                    res.redirect(`/customer/${cur}`);
                }
                else{
                    console.log(err);
                }
            })
        }
        });

});
app.post("/registerc",uploadi,function(req,res){

    
    const newUser=new Userc({
    username:req.body.username,
    password:md5(req.body.password),
    name:req.body.name,
    address:req.body.address,
    phoneNumber:req.body.pno,

    image:"NoImage",

    imagei:req.file.filename 

  
    });
    newUser.save();
    
    res.redirect("/loginc");
  });

app.get("/image/:imagedetail",function(req,res){
    res.render("image",{image:req.params.imagedetail});
});

app.post("/loginc",function(req,res){
    const username=req.body.username;
    const password=md5(req.body.password);
 
   Userc.findOne({username:username},function(err,foundUser){
    console.log('hello');
       if(err){
           console.log(err);
       }else{
           if(foundUser){
               if(foundUser.password===password){
                   req.session.isAuth=true;
                   console.log('hel');
                   var link=`/customer/${username}`;
                   res.redirect(link);
               }
               else{
                   res.render("loginc",{error:"incorrect password"});
               }
               
           }
           else{
               res.render("loginc",{error:"incorrect username"});
           }
       }
   })

});
app.get("/users",isAuth,function(req,res){
    if(req.isAuthenticated)
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
               
            }
        });
    }
});

app.post("/profile",function(req,res){
    const user=req.body.profileName;
    Userc.findOne({username:user},function(err,userInfo){
        UserDetail.find({userEmail:user},function(err,bookingInfo){
          Review.find({username:user},function(err,reviewInfo){
            Query.find({username:user},function(err,queryInfo){
             res.render("profile",{userdetail:userInfo,reviews:reviewInfo,queries:queryInfo,previousBookings:bookingInfo});
        });
       });
     });
    });
});
app.post("/users",function(req,res){
    res.redirect("/users");
});
app.post("/review/:user",function(req,res){
    const newReview=new Review({
        username:req.body.review,
        content:req.body.reviewBody
    });
    newReview.save();
    res.redirect(`/customer/${req.params.user}`);
});
app.post("/editProfile",function(req,res){
    const update={
        name:req.body.name,
        address:req.body.address,
        phoneNumber:req.body.phoneNumber
    };
    var user=req.body.id;
     Userc.findOneAndUpdate({username:user},update,function(err,userInfo){
         if(!err){
         console.log(userInfo);   
         }
         else{
             console.log("err");
         }
     });
     function myFun(){
     Userc.findOne({username:user},function(err,userInfo){
        UserDetail.find({userEmail:user},function(err,bookingInfo){
          Review.find({username:user},function(err,reviewInfo){
            Query.find({username:user},function(err,queryInfo){
             res.render("profile",{userdetail:userInfo,reviews:reviewInfo,queries:queryInfo,previousBookings:bookingInfo});
        });
       });
     });
    });
}
setTimeout(myFun,2000);
});

app.get("/logout",function(req,res){
    console.log(req.user.email);
    req.logout();
    
    res.redirect("/loginc");
});
app.post("/query/:user",function(req,res){

    const newquery=new Query({
        username:req.body.query,
        queryContent:req.body.queryBody,
        reply:""
    });
    newquery.save();
    res.redirect(`/customer/${req.params.user}`);
});

app.get("/queryPage",isAuth,function(req,res){
    if(req.isAuthenticated){
    Query.find({},function(err,queryList){
        if(queryList.length>=0)
        {
            res.render("queryPage",{queries:queryList});
        }
        if(err)
        {
            console.log(err);
        }
        else{
            console.log("Successfully query list shown");
        }
    });
}
});
app.post("/queryReply",function(req,res){
    var queryId=req.body.queryId;
    var qcontent=req.body.queryBody;
    const update={
        reply:req.body.queryBody
    };
     Query.findOneAndUpdate({_id:queryId},update,function(err,queryInfo){
         if(!err){
         console.log(queryInfo);     
         }
         else{
             console.log("err");
         }
     });
   res.redirect("/queryPage");

});
app.post("/statusAccept",function(req,res){
   const userId=req.body.accept;
   console.log(userId);
   const update={
       status:"Accepted"
   };
    UserDetail.findOneAndUpdate({_id:userId},update,function(err,userInfo){
        if(!err){
        console.log(userInfo);     
        var transport=nodemailer.createTransport(
            {
                host: 'smtp.gmail.com',
            port: 465,
            secure: true,
                auth:{
                    user:'vasbhach@gmail.com',
                    pass:'303560db'
        
        
                }
            }
        )
        
        var mailOptions={
            from:'vasbhach@gmail.com',
            to:userInfo.userEmail,
            subject:'VBC RENTALS',
            text:`Hello ${userInfo.userName}, Your request for ${userInfo.modelName} has been Accepted. For more information about your bookings, please login to our website. You can pickup your desired vehicle on the day of your reservation from our location. Refer the contact page of our website for more details. Thank you`
        }
        transport.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            } else{
                console.log('email sent'+info.response);
            }
        });

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
        status:"Denied"
    };
     UserDetail.findOneAndUpdate({_id:userId},update,function(err,userInfo){
         if(!err){
         console.log(userInfo);
         Vehicle.findOne({carNo:userInfo.carNumber},function(err,avl){
            if(!err){
                AvailVehicle.exists({carNo:userInfo.carNumber},function(err,doc1){
                 if(!err){
                    if(!doc1)
                   {
                           const availvehicle1=new AvailVehicle({
                               modelName:avl.modelName,
                               carYear:avl.carYear,
                               carNo:avl.carNo,
                               carTrans:avl.carTrans,
                               carRate:avl.carRate,
                               image:avl.image
                           });
                       availvehicle1.save();
                    }
                }
                });
            }
            });
         var transport=nodemailer.createTransport(
            {
                host: 'smtp.gmail.com',
            port: 465,
            secure: true,
                auth:{
                    user:'vasbhach@gmail.com',
                    pass:'303560db'
        
        
                }
            }
        )
        
        var mailOptions={
            from:'vasbhach@gmail.com',
            to:userInfo.userEmail,
            subject:'VBC RENTALS',
            text:`Hello ${userInfo.userName}, Your request for ${userInfo.modelName} has been denied due to some unavoidable reasons. We are sorry for the inconvenience. You are requested to check our website for further bookings. Thank you`
        }
        transport.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            } else{
                console.log('email sent'+info.response);
            }
        });


         }
         else{
             console.log("err");
         }
     });
     res.redirect("/users");
 
 });
  app.post("/addBack",function(req,res){
 
     let vehicleId=req.body.number;
     UserDetail.findOne({_id:vehicleId},function(err,doc){
     Vehicle.findOne({carNo:doc.carNumber},function(err,avl){
         if(!err){
             AvailVehicle.exists({carNo:doc.carNumber},function(err,doc1){
              if(!err){
                 if(!doc1)
                {
                        const availvehicle1=new AvailVehicle({
                            modelName:avl.modelName,
                            carYear:avl.carYear,
                            carNo:avl.carNo,
                            carTrans:avl.carTrans,
                            carRate:avl.carRate,
                            image:avl.image
                        });
                    availvehicle1.save();
                 }
             }
             });
             var ve=doc.modelName;
             var cno=doc.carNumber;
             var price=doc.totPrice;

             var transport=nodemailer.createTransport(
                {
                    service: 'gmail',
                       auth: {
                        user: 'sravanthvasuki@gmail.com',
                         pass: 'sravan303560'
                       }
                }
            )
            
            var mailOptions={
                from:'sravanthvasuki@gmail.com',
                to:doc.userEmail,
                subject:'VBC RENTALS',
                text:`Hello ${doc.userName}. Your ride with ${doc.modelName} has been comepelted. Selected vehicle name : ${ve}. Selected Vehicle number is ${cno}, Total Price to be paid : ${price}. Please leave your feedback on our portal. We hope you enjoyed your ride and looking forward for more happy bookings. Thank you`
            }
            transport.sendMail(mailOptions,function(error,info){
                if(error){
                    console.log(error)
                } else{
                    console.log('email sent'+info.response);
                }
            });
            BookedVehicle.deleteOne({carNo:doc.carNumber},function(err){
                if(!err){
                    console.log("Deleted from booked vehicles");
                }
                else{
                    console.log(err);
                }
            });
        }
         });
        });
             
     res.redirect("/users");
     
  });
 

const userDetails1=[];
app.get("/users",isAuth,function(req,res){
    if(req.isAuthenticated)
    {

        UserDetail.find({},function(err,userDetails1){
            if(userDetails1.length>0)
            {
                res.render("users",{newListItems:userDetails1});
            }
            if(err){
                console.log(err);
            }
      })
      res.render("users",{newListItems:userDetails1});

    }
    
});

app.post("/userSearch",function(req,res){
    var value=req.body.search;
    console.log(value);
    if(value===" "){
        res.redirect("/users");
    }
    let searchDetails=[];
    UserDetail.find({},function(err,userDetails){
        userDetails.forEach(function(userDetail){
            if((userDetail.userEmail).includes(value)===true){
                searchDetails.push(userDetail);
            }
        });
        console.log(searchDetails);
        res.render("users",{newListItems:searchDetails});
    });
})

app.post("/logout",function(req,res){
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect("/");
    })
 })

app.post("/logouta",(req,res) =>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect("/");
    });
});


app.post("/back/:page",function(req,res){
    res.redirect(`/${req.params.page}`);
});
app.listen(3000,function(){
    console.log("Server started on posrt 3000");
});
