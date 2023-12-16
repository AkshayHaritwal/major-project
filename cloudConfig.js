const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage}= require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name :process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,

}); // yaha humne .env file se creditianls ko acwire kar liya hai



const storage = new CloudinaryStorage({  //yaha humne storage define kar di hai ki ye file kaha jake save hogi 
    cloudinary:cloudinary, params:{
        folder: 'wanderlust_DEV',
        allowedFormats :["png","jpg" ,"jpeg"],
    }
});

module.exports={cloudinary,storage};   // yaha humne inko export karwa diya hai inhe hum use karenge listings.js iske liye sabse pahle isko require kae lenge 