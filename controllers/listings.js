const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN ;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });




module.exports.index =  async (req, res) => { 
    const allListings = await Listing.find({});  // yaha humne jo listing.js se data import ho raha hai usse ek variable me store karwa diya hai 
    res.render("listings/index.ejs", { allListings }); // yaha humne render karwa diya hai views folder me listing folder ke andar jo index.ejs file hai usse and allListings variable ko 
  };


module.exports.renderNewForm =   (req, res) => {
    res.render("listings/new.ejs");
    
  };


module.exports.showListing =  async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate : {path:"author",},}).populate("owner");  // .populate ki help se reviews ki sabhi details show ho jaayegi 
    if (!listing) {  // so agar jis listing ke liye request kiya gaya hai wo exist nahi karti to given error flash hoga and hum /listings pe redirect kar jaayenge 
      req.flash("error" , "liting you requested does not exist");
      res.redirect("/listings");
      
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  };

module.exports.createListing = async (req, res ,next) => { // so iss tarah se hum try and catch ki jagah wrapAsync ko use kar sakte hai 
   

  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send()
    
  
  
  let url = req.file.path;
    let filename = req.file.filename; // yaha humne url and filename ko extract kar liya hai 
    const newListing = new Listing(req.body.listing); // yaha humne newListing variable me pura data store karwa diya hai req.body se extract karke 
    newListing.owner = req.user._id;
    newListing.image = {url, filename}; // yaha humne image me url and filename send kaar diya hai 

    newListing.geometry = response.body.features[0].geometry;

    let saveListing = await newListing.save(); // data ko database me save karwa diya hai 
    console.log(saveListing);
    req.flash("success", "New listing created");
    res.redirect("/listings"); //jese hii data save hoga hum wapas redirect ho jaayenge to listing route 
  

};


module.exports.renderEditForm =  async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error" , "liting you requested does not exist");
      res.redirect("/listings"); 
      
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/h_300,w_2560");
    res.render("listings/edit.ejs", { listing ,originalImageUrl});
  };


module.exports.updateListing =async (req, res) => {
    let { id } = req.params;
   
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image ={url, filename};
    await listing.save();
  }
    req.flash("success" , "listing updated sucessfully");
    res.redirect(`/listings/${id}`);
  };
  
  
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  };  