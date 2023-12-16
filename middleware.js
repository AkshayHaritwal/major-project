const Listing = require("./models/listing");
const Review = require("./models/review.js")
const expressError = require("./utils/expressError.js");
const  {listingSchema , reviewSchema} = require("./schema.js");// yaha humne listingSchema ko require kar liya hai 

  // so agar hum new post create karte hai and usme kuch information miss kar dete hai to listingSchema.validate usko identify kar lega
  module.exports.validateListing = (req , res , next ) =>{  // so yaha humne listing validation ko function ki form me ek variable me store karwa liya hai ab jaha bhi listing validation karwana hai waha iss variable ko likh sakte hai 
    let{error} = listingSchema.validate(req.body); // yaha humne listing validation me agar koi error aata hai to usse extract kar liya hai
    if (error) {
      throw new expressError(400,error); // so agar result me koi error aata hai to wo yaha print ho jaayega
    }
    else{
      next(); // else next code run ho jaayega
    }
  }



  
module.exports.validateReview = (req , res , next ) =>{  
    let{error} = reviewSchema.validate(req.body);
    if (error) {
      throw new expressError(400,error); 
    }
    else{
      next(); 
    }
  }
  


module.exports.isLoggedIn = (req, res , next) =>{
    
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;  // iski help se user login hone ke baad orginal url pe redirect ho jaayega
        req.flash("error" , "you must be logged in to create a listing");
       return res.redirect("/login");
      };
      next();

}


module.exports.saveRedirectUrl = (req, res, next)=>{ // yaha humne redirect url ko locals me save karwa liya hai 
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        
    }
    next();
}




module.exports.isOwner = async(req, res, next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error" ,"you dont have permission to edit");
     return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor = async(req, res, next)=>{
  let { id , reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error" ,"you dont have permission to delete this review");
   return res.redirect(`/listings/${id}`);
  }
  next();
}

