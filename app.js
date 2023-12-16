if(process.env.NODE_ENV != "production"){
  require('dotenv').config();

} 


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const listingRouter = require("./routes/listing.js");  // yaha humne routes folder me jo listing.js hai usse require kar liya hai 
const reviewRouter = require("./routes/review.js"); // yaha humne reviews ko require kar liya hai 
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL ;


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate); //yaha humne engine ko set kar diya hai to ejsMate 
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter: 24*3600,
})

store.on("error", ()=>{
  console.log("error in mongo session store");
})

const sessionOptions = {
  secret : process.env.SECRET,
  store,
  resave : false, 
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,   // so itne time baad ye cookie browser se delete ho jaayegi 
    maxAge : + 7* 24 * 60 * 60 * 1000, // ye humne maximum age set kar di hai cookies ki 
    httpOnly : true , // this is for security 
  }
  
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // yaha humne passport ko initialize kar liya hai 
app.use(passport.session()); //iski help se user ko ek session me baar baar login nahi karna padega
passport.use(new LocalStrategy (User.authenticate())); // iski help se sabhi user ko localstrategy ke through authencticate hoke aana padega

passport.serializeUser(User.serializeUser()); // iski help se user se related jitni bhi information hai usse hum session me store karwate hai 
passport.deserializeUser(User.deserializeUser()); // iski help se agar user session end kar deta hai to usse related information ko remove karne ke liye iska use kiya hai 


app.use((req, res, next)=>{
  res.locals.success = req.flash("success"); // so jese hii req me success aayega to success wala message print ho jaayega
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // so yaha jo current user hai uski information currUser variable me store ho jaayegi 
  next();
})

// demoUser route
app.get("/demouser",async (req, res)=>{
  let fakeUser = new User({
    email:"rohit@gmail.com",
    username : "Rohit sharma",
  }); // yaha humne demoUser ke liye route create kar liye hai isme email and username register karwa diya hai 

  let registeredUser = await User.register(fakeUser , "helloworld"); // ab iss information ko db me store karwane ke liye hum User.register ko use karenge jisme hume fakeUser call back ke sath password bhi dena hoga 
  res.send(registeredUser);



})












app.use("/listings", listingRouter);   // /listings ko jab request send ki jaayegi to listings wala object use hoga

app.use("/listings/:id/reviews", reviewRouter);  //  reviews  ''      ''

app.use("/", userRouter); 










app.all("*", (req, res , next)=>{   // so yaha * ka matlab hai agar user aise route ko request send kar deta hai jo exist nahi karta to uske liye ye error send hoga 
  next (new expressError(404 ,"page not found"));
})



app.use((err , req , res , next)=>{
  let {statuscode = 500, message = "something went wrong"}= err;
  res.status(statuscode).render("error.ejs", {message});  // yaha humne status code and messaage ke sath error.ejs file ko render karwa diya hai ab jese hii error aayega is file ka code render hoke execute ho jaayega
  // res.status(statuscode).send(message);
})




app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
