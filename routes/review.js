const express = require("express");
const router = express.Router({mergeParams:true}); // yaha humne router ko require kar liya hai 
const wrapAsync = require("../utils/wrapAsync.js"); // yaha humne wrapAsync ko require kar liya hai 
const expressError = require("../utils/expressError.js");
const Review = require("../models/review.js");  //yaha hamne review.js ko require kar liya hai 
const Listing = require("../models/listing.js");  //yaha hamne listing.js ko require kar liya hai 

const reviewController = require("../controllers/reviews.js")


const{validateReview, isLoggedIn, isReviewAuthor}= require("../middleware.js");





  
  
  // review route 
  router.post("/" ,isLoggedIn,validateReview, wrapAsync(reviewController.createReview));
  
  // delete route for reviews
  
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
  

  module.exports = router;  // yaha humne router object ko export kar diya hai
