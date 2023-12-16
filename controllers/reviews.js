const Review = require("../models/review.js");  //yaha hamne review.js ko require kar liya hai 
const Listing = require("../models/listing.js");  //yaha hamne listing.js ko require kar liya hai 


module.exports.createReview = async (req, res) =>{
    let listing = await Listing.findById(req.params.id); // yaha humne listing ki id extract kar li  hai 
    let newReview = new Review(req.body.review); // yaha humne jo new review req ki body me add hoga usko extract kar liya 
    newReview.author = req.user._id;
    listing.reviews.push(newReview); // yaha humne new review ko push kar diya reviews me 
     
    await newReview.save();
    await listing.save();
  

    console.log("new review saved");
    req.flash("success", "new review created");
    res.redirect(`/listings/${listing._id}`);
  }


module.exports.destroyReview = async(req, res)=>{  // yaha jab reviewid pe request jaayegi to given operation perform ho jaayega
    let{id, reviewId} = req.params;  // yaha humne req se listing id and review id ko extract kar liya hai 
    await Listing.findByIdAndUpdate(id, {$pull:{reviews : reviewId}}); //yaha listing ki id paas kar di hai sabse pahle then pull (delete) kar rahe hai reviews array se review id ko 
    await Review.findByIdAndDelete(reviewId); //yaha review id ki help se uss review ko delete kar diya jaayega
    res.redirect(`/listings/${id}`); // iske baad hum wapas us particular listing wale page pe redirect ho jaayenge
    
  }
