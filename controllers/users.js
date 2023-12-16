const User = require("../models/user.js");


module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");  // yaha humne signup.ejs ko render karwa diya hai 
 }


module.exports.signup = async (req, res)=>{




    try {
            let{username , email, password} = req.body; // yaha 3no chize extract kar li hai 
            const newUser = new User ({email , username}); //yaha newUser variable me email and password ki value store karwa di hai 
            const registeredUser = await User.register (newUser,password); //yaha new user ko register karwa diya hai with password
            console.log(registeredUser);

            req.login(registeredUser , (err) =>{  // req.login ki help se user sign-up karte hii login ho jaayega isme 2 parameter jaate hai registeredUser ki information and err , agar user successfully register ho jaata hai to login ho jaayega nahi to error print ho jaayega
                if (err) {
                    return next(err);
                    
                }
                req.flash("success", "welcome to wanderlust");
                res.redirect("/listings");
            });
    } catch (err) {
        req.flash("error" , err.message);
        res.redirect("/signup");
        
    }
    
}


module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
}



module.exports.login = async(req,res) =>{
    req.flash("success","welcome to wanderLust");
   let redirectUrl = res.locals.redirectUrl || "listings"; // iski help se login karte hi respected url pe redirect kar jaayenge
   res.redirect(redirectUrl);
}

module.exports.logout =(req,res,next)=>{
    req.logout((err)=>{
        if (err) {
            next(err);
            
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
}