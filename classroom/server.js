const express = require("express");
const app = express();
const  cookieParser = require("cookie-parser");
const posts = require ("express-session");
const session = require("express-session");
const flash = require("connect-flash");  // yaha humne flash ko require kar liya hai , flash ko express-session ke sath hii use kiya ja sakta hai 
const path = require("path");
app.use(flash()); // flash ko use karne ke liye ye code likhte hai 


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.use(cookieParser("strongcode"));  // ye strongcode hum tab likhte hai jab hume signed cookies send kar ni ho


// app.get("/getcookies" ,(req, res)=>{
//     res.send("send u some cookies");
// });


// app.get("/",(req, res)=>{
//     res.cookie("great" , "hello");   // jese hii hum / ko request send karenge to response me cookies send ho jaayegi cookies name value pair me jaati hai greet name hai and hello value hai 
//     res.cookie("Akshay" ,"human");
//     res.cookie("name" , "rohit");
//     res.send("hi i am root"); // cookies ko dekhne ke liye localhost:3000/ pe request send karenge then inspect then application then cookies
//     // iske baad  agar hume cookies ko parse karna hai t uske liye hum ek npm package use karenge command ---> npm i cookie-parser  , then isko require kar lenge 
//     console.dir(req.cookies);  // iski help se jo cookies humne send ki hai wo console me print hoke mil jaayegi 

//     let {name} = req.cookies;  // yaha humne cookie ke andar jo name hai usko access kar liya hai ab jab hum console.log karenge name to iski  value print ho jaayegi 
//     console.log(`hello ${name}` );
// });


// app.get("/getsignedcookies", (req , res) =>{  
//     res.cookie("country" , "india" , {signed :true});  // iss tarah se hum signed cookies send kar sakte hai ab jese hii is route pe request aayegi to signed cookie send hogi agar koi iss cookie me changes karta hai to wo detact ho jaayenge
//     res.send("signed cookies send");
//     console.log(req.signedCookies);    // iski help se signed cookies print ho jaayegi 
// });


// express session --------------------------------------------->

app.use(session({secret:"mysupersecretstring" , resave:false , saveUninitialized:true}));  // express session ke liye yaha humne ek secret string define kar di hai

//ab jab bhi hum route pe request send karenge to har req ke sath cookies me ek session id store ho jaayegi 
app.get("/test",(req,res)=>{
    res.send("test is sucessfull");
});

app.get("/reqcount",(req , res)=>{  
    if (req.session.count) {
        req.session.count++;
        
    } else {
        req.session.count = 1;  // agar request.session.count me koi value nahi to 1 set ho jaayegi uske baad value ++ hoti jaayegi
        
    }
    res.send(`you send a request ${req.session.count}times`); // yaha hum jitni  baar iss route ko request send karenge utna number print ho jaayega 
})



app.get("/register",(req, res)=>{
    let{name = "anonymous"} = req.query; // yaha user query string ki form me jo req send karega usko humne extract karwa liya hai 
    req.session.name = name; // yaha humne req.session me name naam ka ek or parameter add kar diya hai jiki value name variable hai 
    if (name == "anonymous") {
        req.flash("error" , "registration failed");  // agar user name anonymous print hota hai to ye message flash hoga nahi to else wala
    } else {
        
        req.flash("sucess", "regestration sucessfull"); // jese hii is route pe request aayegi ye messeage flash hoga refresh karne pe gayab ho jaayega
    }
    res.redirect("/hello"); // jese hii hum ispe correct request send karenge to /hello pe redirect ho jaayenge
});

app.get("/hello",(req,res)=>{

    res.locals.successMsg= req.flash("sucess"); // iski help se success message flash hoga 
    
    res.locals.errorMsg= req.flash("error");// iski help se error message flash hoga 

    res.render("page.ejs" ,{name : req.session.name });  //yaha me req.session.name ko use kar paa rahe hai kyuki wo session me store ho gaya hai // jo flash wala message hai usse humne yaha access kar liya hai 
    // yaha humne name ki help se jo user ne query string me name send kiya hai usse print karwa denge and msg ki help se flash wale message ko 
});


// flash ko display karwane ke liye sabse pahle classroom folder me views naam se folder create karenge then usme page.ejs create karenge  



app.listen(3000,()=>{
    console.log("server listening on port 3000")
});