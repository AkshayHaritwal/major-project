const express = require("express");
const router = express.Router(); // yaha humne router ko require kar liya hai 
const wrapAsync = require("../utils/wrapAsync.js"); // yaha humne wrapAsync ko require kar liya hai 
const expressError = require("../utils/expressError.js");
const  {listingSchema } = require("../schema.js");// yaha humne listingSchema ko require kar liya hai 
const Listing = require("../models/listing.js");  //yaha hamne listing.js ko require kar liya hai 
const {isLoggedIn, isOwner , validateListing}= require("../middleware.js"); 
const listingController = require("../controllers/listings.js");

const multer = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({storage}); // iski help se data cloudinary ki storage me upload ho jaayega



// index and create route  ----->
// iss tarah se jo bhi / wale route hai unko humne ek jagah combine kar liya hai 
router.route("/").get(wrapAsync(listingController.index)).post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync (listingController.createListing));



router.get("/new", isLoggedIn , listingController.renderNewForm );

//show , update and delete route -------> 
router.route("/:id").get(listingController.showListing).put(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing)).delete(isLoggedIn,isOwner, wrapAsync (listingController.destroyListing));  
  

  //New Route
  
  
  //Edit Route
  router.get("/:id/edit",isLoggedIn ,isOwner,wrapAsync ( listingController.renderEditForm));
  
  
  


  module.exports = router;  // yaha humne router object ko export kar diya hai
  
  